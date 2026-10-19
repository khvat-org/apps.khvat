#!/usr/bin/env bash
# Pulls the current lessons from the API and rebuilds the offline dump
# in src/pages/education/learning/model/dump (one file per language + index.ts).
#
# Usage: ./scripts/update-lessons-dump.sh
# Requires: curl, jq. Formatting via prettier from the monorepo root.

set -euo pipefail

API_URL="${API_URL:-https://dev1.khvat.org/api/v2/lessons}"
LANGS=(ru en de fr id ko it es-ES es-MX pt-BR pt-PT zh-CN zh-HK zh-TW)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(cd "$APP_DIR/../.." && pwd)"
DUMP_DIR="$APP_DIR/src/pages/education/learning/model/dump"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

# zh-CN -> ZhCN, es-ES -> EsES, en -> En
var_suffix() {
  local out="" part
  IFS='-' read -ra parts <<<"$1"
  for part in "${parts[@]}"; do
    out+="$(tr '[:lower:]' '[:upper:]' <<<"${part:0:1}")${part:1}"
  done
  echo "$out"
}

# 1. Download everything first so a network error doesn't leave a half-updated dump
for lang in "${LANGS[@]}"; do
  echo "→ $lang"
  curl -fsS --retry 3 "$API_URL?language=$lang&app=alphabet" -o "$TMP_DIR/$lang.json"

  count=$(jq '.data | length' "$TMP_DIR/$lang.json")
  if [[ "$count" -eq 0 ]]; then
    echo "✗ $lang: empty data" >&2
    exit 1
  fi
  echo "  chapters: $count"
done

# 2. Replace old dump files
find "$DUMP_DIR" -maxdepth 1 -name '*.ts' ! -name 'index.ts' -delete

imports=""
entries=""
for lang in "${LANGS[@]}"; do
  var="dump$(var_suffix "$lang")"
  printf 'export const %s = %s as const;\n' "$var" "$(jq -S '{ data: .data }' "$TMP_DIR/$lang.json")" \
    >"$DUMP_DIR/$lang.ts"

  imports+="import { $var } from \"./$lang\";"$'\n'
  entries+="  \"$lang\": $var as unknown as { data: Chapter[] },"$'\n'
done

cat >"$DUMP_DIR/index.ts" <<EOF
import { Chapter } from "../types";

$imports
const dumps: Record<string, { data: Chapter[] }> = {
$entries};

export function getDump(lang: string): unknown[] | null {
  return dumps[lang]?.data ?? null;
}
EOF

# 3. Format like the rest of the repo
(cd "$ROOT_DIR" && ./node_modules/.bin/prettier --log-level warn --write "$DUMP_DIR/*.ts")

echo "✓ dump updated: $DUMP_DIR"
