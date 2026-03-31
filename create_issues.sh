#!/bin/bash

REPO="braindatalab/exact"
CSV_FILE="issues.csv"

# Skip header
tail -n +1 "$CSV_FILE" | while IFS=',' read -r raw_title raw_body raw_labels; do
  # Remove surrounding quotes and clean up spacing
  title=$(echo "$raw_title" | sed 's/^"//;s/"$//' | xargs)
  body=$(echo "$raw_body" | sed 's/^"//;s/"$//' | xargs)
  labels=$(echo "$raw_labels" | sed 's/^"//;s/"$//' | xargs)

  # Write body to temp file
  tmpfile=$(mktemp)
  echo "$body" > "$tmpfile"

  echo "🛠 Creating issue: $title"

  # Build label flags
  label_args=()
  IFS=',' read -ra label_array <<< "$labels"
  for label in "${label_array[@]}"; do
    label_args+=(--label "$label")
  done

  # Create the issue
  gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --body-file "$tmpfile" \
    "${label_args[@]}"

  rm "$tmpfile"

  echo "✅ Created: $title"
done
