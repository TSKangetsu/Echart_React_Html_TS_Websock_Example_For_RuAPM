var path = require('path');
module.exports = {
    target: 'web',
    entry: './Main.tsx',
    mode: 'development',
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
        }, ],
    },
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'bundle.js'
    },
};