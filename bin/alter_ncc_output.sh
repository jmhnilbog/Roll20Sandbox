var='var __dirname = "";'
sed -i ".bak" "1s/.*/$var/" "build/index.js"
rm "build/index.js.bak"

# to upload to roll20
mv "build/index.js" "build/upload.js"

# to run locally
cp "build/upload.js" "build/local.js"
cat "lib/tableExport.js" "lib/recursiveTable.js" > "build/libs.js"
sed -i ".bak" -e "/\"REPLACE WITH LIBS\"/r build/libs.js" -e "s///" "build/local.js"
rm "build/local.js.bak"
rm "build/libs.js"


# rm build/libs.js