const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
	entry: "./src/index.js",

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				loader: "buble-loader",
				include: path.join(__dirname, "src"),
				options: {
					jsx: "h"
				}
			},
			{
				test: /\.styl$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					"css-loader",
					"stylus-loader"
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					"css-loader"
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [
					"file-loader"
				]
			}
		]
	},

	resolve: {
		modules: [
			path.resolve(__dirname, "src"),
			"node_modules"
		]
	},

	devServer: {
		contentBase: "./dist"
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: "blackbox"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].bundle.css"
		})
	],

	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist")
	}
};