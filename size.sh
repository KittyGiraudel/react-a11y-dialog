BASE_PATH=dist/react-a11y-dialog

# Build the dist files
npm run build -- --silent

# Gzip files
gzip -9fkc $BASE_PATH.min.js > $BASE_PATH.min.js.gz
gzip -9fkc $BASE_PATH.esm.min.js > $BASE_PATH.esm.min.js.gz

# Brotli files
brotli -8fkc $BASE_PATH.min.js > $BASE_PATH.min.js.br
brotli -8fkc $BASE_PATH.esm.min.js > $BASE_PATH.esm.min.js.br

# Print sizes
ls -lh $BASE_PATH.js            | awk '{print "CJS raw size    :", $5"B"}'
ls -lh $BASE_PATH.min.js        | awk '{print "CJS min size    :", $5"B"}'
ls -lh $BASE_PATH.min.js.gz     | awk '{print "CJS gzip size   :", $5"B"}'
ls -lh $BASE_PATH.min.js.br     | awk '{print "CJS brotli size :", $5"B"}'

echo ""

ls -lh $BASE_PATH.esm.js        | awk '{print "ESM raw size    :", $5"B"}'
ls -lh $BASE_PATH.esm.min.js    | awk '{print "ESM min size    :", $5"B"}'
ls -lh $BASE_PATH.esm.min.js.gz | awk '{print "ESM gzip size   :", $5"B"}'
ls -lh $BASE_PATH.esm.min.js.br | awk '{print "ESM brotli size :", $5"B"}'

# Clean up compressed files
rm -r dist/*.{br,gz}
