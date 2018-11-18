const merge = require("webpack-merge")
const common = require("./webpack.common")
const MinifyPlugin = require("babel-minify-webpack-plugin")
const path = require("path")

module.exports = merge(common, {
	output: {
		filename: "[hash].bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "production",
	devtool: "source-map",
	optimization: {
		splitChunks: {
			chunks: "all",
		},
		moduleIds: "hashed",
	},
	plugins: [new MinifyPlugin()],
})
