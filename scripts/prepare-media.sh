#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# ROLLA — préparation des vidéos du site (nécessite ffmpeg)
#
# Principes : proportions d'origine conservées (aucun recadrage ni
# déformation), cadence d'origine conservée, pas d'agrandissement, son retiré
# (lecture automatique toujours muette).
#
#   ./scripts/prepare-media.sh hero <video>
#       Vidéo du hero (lue une fois à l'ouverture, puis arrêtée sur la
#       dernière image).
#       → public/media/hero/hero.mp4         (côté le plus long ≤ 1920 px)
#         public/media/hero/hero-mobile.mp4  (côté le plus long ≤ 1280 px)
#         public/media/hero/hero-poster.jpg  (première image)
#         public/media/hero/hero-still.jpg   (dernière image)
#
#   ./scripts/prepare-media.sh experience <video> [video-mobile] [nb-images]
#       Séquence « The Experience » synchronisée au scroll.
#       - Ordinateur : vidéo optimisée pour le scrubbing (une image-clé toutes
#         les 4 images, sans B-frames) → positionnement image par image.
#       - Mobile : séquence d'images WebP (120 par défaut), plus fluide que la
#         vidéo sur téléphone. Une vidéo verticale est utilisée telle quelle ;
#         une vidéo horizontale sans version mobile est recadrée au centre en 9:16.
#       → public/media/experience/experience.mp4, experience-poster.jpg,
#         experience-still.jpg, mobile/f0001.webp …
#
# Après exécution, reporter les valeurs affichées dans src/content/media.ts.
# -----------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-}"

# Réduit le côté le plus long à $2 px au maximum, sans jamais agrandir.
fit() { echo "scale='if(gte(iw,ih),min($1,iw),-2)':'if(gte(iw,ih),-2,min($1,ih))':flags=lanczos"; }
dims() { ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$1"; }
duration() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

encode_hero() {
  local src="$1" out="$ROOT/public/media/hero"
  mkdir -p "$out"
  ffmpeg -v error -stats -y -i "$src" -an -vf "$(fit 1920),format=yuv420p" \
    -c:v libx264 -preset slow -crf 21 -profile:v high -movflags +faststart "$out/hero.mp4"
  ffmpeg -v error -stats -y -i "$src" -an -vf "$(fit 1280),format=yuv420p" \
    -c:v libx264 -preset slow -crf 23 -profile:v high -movflags +faststart "$out/hero-mobile.mp4"
  ffmpeg -v error -y -i "$out/hero.mp4" -frames:v 1 -q:v 2 "$out/hero-poster.jpg"
  ffmpeg -v error -y -sseof -0.1 -i "$out/hero.mp4" -update 1 -q:v 2 "$out/hero-still.jpg"
  echo "✓ Hero : $(dims "$out/hero.mp4") — $(du -h "$out/hero.mp4" | cut -f1) (mobile : $(du -h "$out/hero-mobile.mp4" | cut -f1))"
}

encode_experience() {
  local desktop="$1" mobile="${2:-}" frames="${3:-120}"
  local out="$ROOT/public/media/experience"
  mkdir -p "$out/mobile"
  rm -f "$out"/mobile/f*.webp

  # 1. Vidéo ordinateur optimisée pour le scrubbing
  ffmpeg -v error -stats -y -i "$desktop" -an -vf "$(fit 1920),format=yuv420p" \
    -c:v libx264 -preset slow -crf 24 -profile:v high \
    -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -movflags +faststart \
    "$out/experience.mp4"
  ffmpeg -v error -y -i "$out/experience.mp4" -frames:v 1 -q:v 2 "$out/experience-poster.jpg"
  local half
  half=$(duration "$out/experience.mp4" | awk '{ printf "%.2f", $1 / 2 }')
  ffmpeg -v error -y -ss "$half" -i "$out/experience.mp4" -frames:v 1 -q:v 2 "$out/experience-still.jpg"

  # 2. Séquence d'images mobile
  local msrc="${mobile:-$desktop}"
  local w h vf
  IFS=x read -r w h <<<"$(dims "$msrc")"
  if [ "$h" -ge "$w" ]; then
    vf="scale=720:-2:flags=lanczos"                       # verticale : telle quelle
  else
    vf="scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280"
    echo "⚠ Source horizontale sans version mobile : recadrage central 9:16."
  fi
  local rate
  rate=$(awk -v n="$frames" -v d="$(duration "$msrc")" 'BEGIN { printf "%.5f", n / d }')
  ffmpeg -v error -y -i "$msrc" -an -vf "fps=${rate},${vf}" -frames:v "$frames" \
    -c:v libwebp -quality 78 -compression_level 6 "$out/mobile/f%04d.webp"

  local count
  count=$(find "$out/mobile" -name 'f*.webp' | wc -l | tr -d ' ')
  echo "✓ Ordinateur : $(dims "$out/experience.mp4") — $(du -h "$out/experience.mp4" | cut -f1)"
  echo "✓ Mobile : ${count} images $(dims "$out/mobile/f0001.webp") — $(du -sh "$out/mobile" | cut -f1)"
  echo
  echo "→ src/content/media.ts : experience.frames = { count: ${count}, width/height : $(dims "$out/mobile/f0001.webp") }"
}

case "$MODE" in
  hero) [ "$#" -ge 2 ] || { echo "Usage: $0 hero <video>" >&2; exit 1; }
        encode_hero "$2" ;;
  experience) [ "$#" -ge 2 ] || { echo "Usage: $0 experience <video> [video-mobile] [nb-images]" >&2; exit 1; }
        encode_experience "$2" "${3:-}" "${4:-120}" ;;
  *) sed -n '2,27p' "$0"; exit 1 ;;
esac
