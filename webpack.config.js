

const path = require('path');


module.exports = {
    mode: "development",
    entry: "./src/browser.js",
    module: {
        rules: [
            {
                test: /\.js$/,
                use:  "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'ess-sdk.js',
        library: 'EssSdk'
    },
    node: {
        fs: 'empty'
    }
}