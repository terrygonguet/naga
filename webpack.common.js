const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
// .BundleAnalyzerPlugin

module.exports = {
	entry: {
		main: "./src/index.js",
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [
		new CleanWebpackPlugin(["dist"]),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({ filename: "[name].css" }),
		new CompressionPlugin({
			exclude: /\.map$/i,
		}),
		// new BundleAnalyzerPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{ loader: "css-loader", options: { importLoaders: 1 } },
					"postcss-loader",
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: "file-loader",
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				loader: "babel-loader",
			},
		],
	},
}
