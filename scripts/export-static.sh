#!/bin/bash
# Bygger en statisk förhandsversion i out/ (utan formulär-API). Kör: npm run export
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
tar -C "$ROOT" --exclude=./node_modules --exclude=./.next --exclude=./out --exclude=./.git -cf - . | tar -C "$TMP" -xf -
ln -s "$ROOT/node_modules" "$TMP/node_modules"
rm -rf "$TMP/src/app/api"
(cd "$TMP" && STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_EXPORT=1 npx next build)
# Gör alla sökvägar relativa så att sidan fungerar oavsett var den läggs ut.
OUT="$TMP/out"
find "$OUT" -type f \( -name "*.html" -o -name "*.txt" \) | while read -r f; do
  depth=$(( $(echo "${f#$OUT/}" | tr -cd '/' | wc -c) ))
  prefix="./"; for ((i=0; i<depth; i++)); do prefix="${prefix}../"; done
  sed -i.bak -e "s#\([\"'(]\)/_next/#\1${prefix}_next/#g" -e "s#href=\"/icon.svg#href=\"${prefix}icon.svg#g" "$f" && rm -f "$f.bak"
done
find "$OUT/_next/static/css" -name "*.css" -exec sed -i.bak 's#/_next/static/media/#../media/#g' {} \; -exec rm -f {}.bak \;
find "$OUT/_next/static/chunks" -name "webpack-*.js" -exec sed -i.bak 's#"/_next/"#(function(){var s=document.querySelector("script[src*=\\"_next/static/chunks/webpack-\\"]");return s?s.src.split("_next/static/")[0]+"_next/":"./_next/"})()#g' {} \; -exec rm -f {}.bak \;
rm -rf "$ROOT/out" && mv "$TMP/out" "$ROOT/out" && rm -rf "$TMP"
echo "Klart: out/"
