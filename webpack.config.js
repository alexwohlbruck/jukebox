const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
// const config = require('./config');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

// const host = (process.env.HOST) ? process.env.HOST : config.host;
// const port = (process.env.PORT) ? process.env.PORT : config.port;
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3030; 

const baseConfig = {
	entry: ['webpack-hot-middleware/client', './app/src/main.js'],
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'sass-loader'}]
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['stage-2']
				}
			},
			{
				test: /\.vue$/,
				use: [{loader: 'vue-loader'}]
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'file-loader',
				options: {
					name: 'images/[name].[ext]'
				}
			},
			{
				test: /\.(eot|svg|ttf|woff?)$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]'
				}
			}
		]
	},
	resolve: {
		alias: {
			assets: path.resolve(__dirname, './app/src/assets'),
			vue: 'vue/dist/vue.js'
		},
		extensions: ['.js', '.json', '.vue']
	}
};

const envConfig = {
	development: require('./webpack.config.dev.js'),
	production: require('./webpack.config.prod.js')
};

module.exports = merge(envConfig[env] || {}, baseConfig);