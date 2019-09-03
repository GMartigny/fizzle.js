module.exports = {
    entry: "./src/fizzle.js",
    output: {
        filename: "fizzle.min.js",
        library: "Fizzle",
        libraryTarget: "this",
        libraryExport: "default",
    },
};
