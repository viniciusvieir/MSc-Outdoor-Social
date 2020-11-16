#!/bin/bash

echo 'Fixing PropTypes issues'

if grep -q "export const ViewPropTypes = { style: null };" ../node_modules/react-native-web/dist/index.js; then
    echo "ViewPropTypes fixed already!"
else
    echo "export const ViewPropTypes = { style: null };">> ../node_modules/react-native-web/dist/index.js
fi

if grep -q "allowFontScaling: true," ../node_modules/react-native-button/Button.js; then
    echo "allowFontScaling fixed already!"
else
    sed -e "s/allowFontScaling: Text.propTypes.allowFontScaling,/allowFontScaling: true,/g" ../node_modules/react-native-button/Button.js > ../node_modules/react-native-button/Button.js;
fi
