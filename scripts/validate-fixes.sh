#!/bin/bash
echo 'Validating fixes...'
echo ''
echo 'Checking merge conflicts...'
if grep -r "<<<<<<< HEAD" . --include="*.html" > /dev/null 2>&1; then
  echo 'FAILED: Merge conflicts found'
  exit 1
else
  echo 'OK: No merge conflicts'
fi
echo 'Checking HTML structure...'
for file in *.html; do
  if grep -q "<html" "$file"; then
    echo "OK: $file"
  fi
done
echo 'Validation complete!'