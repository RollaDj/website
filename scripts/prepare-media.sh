#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# ROLLA — préparation des vidéos du site (nécessite ffmpeg)
#
#   ./scripts/prepare-media.sh hero <video>
#       Vidéo de fond du hero : boucle muette, 1920 px max, démarrage rapide.
#       → public/media/hero/hero.mp4 + hero-poster.jpg
#
#   ./scripts/prepare-media.sh experience <video-16:9> [video-9:16] [nb-images]
#       Séquence « The Experience » synchronisée au scroll.
#       - Ordinateur : vidéo optimisée pour le scrubbing (images-clés toutes
#         les 4 images, sans B-frames, sans son, faststart).
#       - Mobile : séquence d'images WebP (90 par défaut), plus fluide que le
#         scrubbing vidéo sur téléphone. Source verticale facultative : à
#         défaut, recadrage central 9:16 de la vidéo ordinateur.
#       → public/media/experience/experience.mp4, experience-poster.jpg,
#         experience-still.jpg (image fixe si animations réduites),
#         public/media/experience/mobile/f0001.webp …
#
# Après exécution, reporter les valeurs affichées dans src/content/media.ts.
# -----------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-}"

encode_hero() {
  local src="$1" out="$ROOT/public/media/hero"
  mkdir -p "$out"
  ffmpeg -v error -stats -y -i "$src" -an \
    -vf "scale='min(1920,iw)':-2,fps=25,format=yuv420p" \
    -c:v libx264 -preset slow -crf 24 -profile:v high -movflags +faststart \
    "$out/hero.mp4"
  ffmpeg -v error -y -i "$out/hero.mp4" -frames:v 1 -q:v 3 "$out/hero-poster.jpg"
  echo "✓ Hero : $(du -h "$out/hero.mp4" | cut -f1)"
}

encode_experience() {
  local desktop="$1" mobile="${2:-}" frames="${3:-90}"
  local out="$ROOT/public/media/experience"
  mkdir -p "$out/mobile"
  rm -f "$out"/mobile/f*.webp

  # 1. Vidéo ordinateur optimisée pour le scrubbing
  ffmpeg -v error -stats -y -i "$desktop" -an \
    -vf "scale='min(1600,iw)':-2,fps=24,format=yuv420p" \
    -c:v libx264 -preset slow -crf 23 -profile:v high \
    -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -movflags +faststart \
    "$out/experience.mp4"
  ffmpeg -v error -y -i "$out/experience.mp4" -frames:v 1 -q:v 3 "$out/experience-poster.jpg"
  # Image fixe (milieu de séquence) pour les visiteurs qui limitent les animations
  local half
  half=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/experience.mp4" | awk '{ printf "%.2f", $1 / 2 }')
  ffmpeg -v error -y -ss "$half" -i "$out/experience.mp4" -frames:v 1 -q:v 3 "$out/experience-still.jpg"

  # 2. Séquence d'images mobile (9:16, 540×960)
  local msrc="${mobile:-$desktop}"
  local crop="scale=540:960:force_original_aspect_ratio=increase,crop=540:960"
  local dur
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$msrc")
  local rate
  rate=$(awk -v n="$frames" -v d="$dur" 'BEGIN { printf "%.5f", n / d }')
  ffmpeg -v error -y -i "$msrc" -an -vf "fps=${rate},${crop}" -frames:v "$frames" \
    -c:v libwebp -quality 72 -compression_level 6 "$out/mobile/f%04d.webp"

  local count
  count=$(find "$out/mobile" -name 'f*.webp' | wc -l | tr -d ' ')
  echo "✓ Ordinateur : $(du -h "$out/experience.mp4" | cut -f1)"
  echo "✓ Mobile : ${count} images, $(du -sh "$out/mobile" | cut -f1)"
  echo
  echo "→ Dans src/content/media.ts : experience.frames.count = ${count}"
}

case "$MODE" in
  hero) [ "$#" -ge 2 ] || { echo "Usage: $0 hero <video>" >&2; exit 1; }
        encode_hero "$2" ;;
  experience) [ "$#" -ge 2 ] || { echo "Usage: $0 experience <video-16:9> [video-9:16] [nb-images]" >&2; exit 1; }
        encode_experience "$2" "${3:-}" "${4:-90}" ;;
  *) sed -n '2,21p' "$0"; exit 1 ;;
esac
