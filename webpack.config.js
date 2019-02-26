const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var mode = (process.env.NODE_ENV == "production" ? "production" : "development");
var configPath = (mode == "production" ? "./config.robot" : "./config.local");

module.exports = {
    mode: mode,
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
		new CleanWebpackPlugin([ "dist/*" ]),
		new HtmlWebpackPlugin({
			title: "blackbox"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].bundle.css"
		}),
		new webpack.DefinePlugin(require(configPath))
	],

	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist")
	}
};