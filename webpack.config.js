const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./fizzle.js",
    plugins: [
        new UglifyJsPlugin(),
    ],
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
        }],
    },
    output: {
        filename: "dist/fizzle.min.js",
        library: "Fizzle",
        libraryTarget: "this",
        libraryExport: "default",
    },
};
