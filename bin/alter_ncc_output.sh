var='var __dirname = "";'
sed -i ".bak" "1s/.*/$var/" "build/index.js"
rm "build/index.js.bak"
mv "build/index.js" "build/output.js"