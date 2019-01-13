#!/bin/bash 

mainBundleName="main.jsbundle"
destPath="./ios/Example/Resource/"
mainBundlePath=${destPath}${mainBundleName}
jsAssetsPath=${destPath}

rm -rf ${jsAssetsPath}assets
echo "Generating ${mainBundleName}..."
node node_modules/react-native/local-cli/cli.js bundle \
    --entry-file index.ios.js \
    --bundle-output $mainBundlePath \
    --platform ios \
    --assets-dest $jsAssetsPath \
    --dev false