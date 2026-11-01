#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# ROLLA — encodage du « film » synchronisé au défilement
#
# Assemble 3 clips (une scène chacun), applique l'étalonnage noir & ivoire
# et produit une vidéo optimisée pour le scrub au scroll :
#   - images-clés très rapprochées (-g 6) => positionnement instantané
#   - pas d'audio, faststart, 24 i/s (cadence cinéma)
#
# Usage :
#   ./scripts/encode-film.sh scene1.mp4 scene2.mp4 scene3.mp4
#
# Sorties :
#   public/media/film/rolla-film.mp4
#   public/media/film/rolla-film-poster.jpg
#
# Les bornes des scènes (en % de la durée totale) sont affichées en fin de
# script : reportez-les dans src/lib/site.ts (FILM_CHAPTER_STARTS).
# -----------------------------------------------------------------------------
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <scene1> <scene2> <scene3>" >&2
  exit 1
fi

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/media/film"
mkdir -p "$OUT_DIR"

W=720          # format portrait 9:16
H=1280
FPS=24
XFADE=0.8      # fondu au noir entre deux scènes (s)
MAX_SCENE=9.5  # durée max d'une scène (s)

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
min() { awk -v a="$1" -v b="$2" 'BEGIN { print (a < b ? a : b) }'; }

D1=$(min "$(dur "$1")" "$MAX_SCENE")
D2=$(min "$(dur "$2")" "$MAX_SCENE")
D3=$(min "$(dur "$3")" "$MAX_SCENE")

OFF1=$(awk -v d="$D1" -v x="$XFADE" 'BEGIN { printf "%.3f", d - x }')
OFF2=$(awk -v d1="$D1" -v d2="$D2" -v x="$XFADE" 'BEGIN { printf "%.3f", d1 + d2 - 2 * x }')
TOTAL=$(awk -v a="$D1" -v b="$D2" -v c="$D3" -v x="$XFADE" 'BEGIN { printf "%.3f", a + b + c - 2 * x }')

# Étalonnage : désaturation, contraste, vignettage, blancs ivoire.
GRADE="hue=s=0,eq=contrast=1.14:brightness=-0.025:gamma=0.96,vignette=PI/5,colorchannelmixer=rr=1:gg=0.962:bb=0.895"
PREP="scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},setsar=1,format=yuv420p"

ffmpeg -v error -stats -y \
  -i "$1" -i "$2" -i "$3" \
  -filter_complex "\
[0:v]trim=0:${D1},setpts=PTS-STARTPTS,${PREP}[a];\
[1:v]trim=0:${D2},setpts=PTS-STARTPTS,${PREP}[b];\
[2:v]trim=0:${D3},setpts=PTS-STARTPTS,${PREP}[c];\
[a][b]xfade=transition=fadeblack:duration=${XFADE}:offset=${OFF1}[ab];\
[ab][c]xfade=transition=fadeblack:duration=${XFADE}:offset=${OFF2},${GRADE},format=yuv420p[v]" \
  -map "[v]" -an \
  -c:v libx264 -preset slow -crf 28 -profile:v high \
  -g 6 -keyint_min 6 -sc_threshold 0 -bf 0 \
  -movflags +faststart \
  "$OUT_DIR/rolla-film.mp4"

ffmpeg -v error -y -ss 0.4 -i "$OUT_DIR/rolla-film.mp4" -frames:v 1 -q:v 3 \
  "$OUT_DIR/rolla-film-poster.jpg"

# Début de chaque scène = milieu du fondu au noir, en fraction de la durée.
S2=$(awk -v o="$OFF1" -v x="$XFADE" -v t="$TOTAL" 'BEGIN { printf "%.3f", (o + x / 2) / t }')
S3=$(awk -v o="$OFF2" -v x="$XFADE" -v t="$TOTAL" 'BEGIN { printf "%.3f", (o + x / 2) / t }')

echo
echo "Durée totale : ${TOTAL}s"
echo "FILM_CHAPTER_STARTS = [0, ${S2}, ${S3}]"
ls -lh "$OUT_DIR"
