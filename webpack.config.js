const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {
	entry: {
		main: "./src/index.js",
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "development",
	plugins: [
		new CleanWebpackPlugin(["dist"]),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
		new VueLoaderPlugin(),
	],
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist",
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"style-loader",
					{ loader: "css-loader", options: { importLoaders: 1 } },
					"postcss-loader",
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader"],
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
		],
	},
}
