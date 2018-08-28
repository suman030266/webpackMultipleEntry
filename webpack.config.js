const fs = require('fs'),
	path = require('path'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	NyanProgressPlugin = require('nyan-progress-webpack-plugin'),
	FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
	paths = require('./bin/paths'),
	UginfiyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
// const HashMapPlugin = require('./plugin/hash-map.js');

// entry
const {base,dist,view,js,page,common,components,css,io,mods,widgets,util,vendor,plugin} = paths;
let entry = { vendor: ['vue'] },
	pages = fs.readdirSync(page);
pages.forEach((dir, index, arr)=>{
	if (dir.indexOf('.') !== 0) { // 过滤隐藏文件
		entry[dir] = path.join(page, dir, 'index.js');
	}
});

// cdn
let cdn = {
    lcdev: '//js.pre.meixincdn.com/m/m/dist/',
    lcvdev: '//js.pre.meixincdn.com/m/m/dist/',
    dev: "//js.pre.meixincdn.com/m/m/dist/",
    watchBuild: "//js.pre.meixincdn.com/m/m/dist/",
    pre: '//js.pre.meixincdn.com/m/m/dist/',
    prd:"//js.meixincdn.com/m/sfm/dist/",
    huidu:"//js.meixincdn.com/m/sfm/dist/",
    production: '//js.meixincdn.com/m/sfm/dist/'
};

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
let env = argv.env || 'dev';
console.log(env);
console.log(cdn[env]);
let config={
    entry,
    output: {
		path: dist,
		filename: 'js/[name].js',
		publicPath: cdn[env]   // '//js.pre.meixincdn.com/m/m/dist/'
    },
    resolve: {
		extensions: [' ', '.js', '.vue'],
		alias: {
			css,  // '~gome/projectsInGitHub/FEENDProject/src/css'
			io,
			common,
			components,
			widgets,
			plugin,
			util,
			dist,
			mods,
			vue: 'vue/dist/vue.js'
		}
    },
    module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				enforce: "pre",
				include: [js],  // src下面的js文件
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [js]
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				include: [js],  // src下面的js文件
				options:{
					loaders: {
						css: ExtractTextPlugin.extract({
							fallback: 'vue-style-loader',  // 再用vue-style-loader解析
							use: 'css-loader'  // 先用css-loader解析
						})
					}
				}
			},
			{
				test: /\.scss$/,
				include: [css],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader'
						}, 
						{
							loader: 'postcss-loader',
							options: {
								plugins: function() {
									return [
										require('autoprefixer')({
											browsers: ['Android >= 4.4', '> 1%'],
											remove: false
										})
									];
								}
							}
						}, 
						{
							loader: 'sass-loader'
						}
					]
				})
			},
			{
				test: /\.(png|jpe?g|gif)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 50,
					context: 'src/images',
					publicPath: cdn[env],
					name: 'images/[path][name].[ext]?v=[hash:7]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10,
					context: 'src/fonts',
					publicPath: cdn[env],
					name: 'fonts/[path][name].[ext]?v=[hash:7]'
				}
			}
		]
	}
};
if(env === 'prd'){
	config.output.filename = 'js/[name]-[chunkhash:7].js';
	config.plugins = [
		new CleanWebpackPlugin([ dist ]),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'js/vendor-[chunkhash:7].js',
			minChunks: Infinity
		}),
		new webpack.DefinePlugin({
		  	'process.env': {
		    	NODE_ENV: JSON.stringify((env==='production'||env==='huidu')?env:'pre')
		  	}
		}),
		// 压缩 js
		new UginfiyjsWebpackPlugin(),
		// 压缩 css
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			// cssProcessorOptions: { discardComments: { removeAll: true },autoprefixer: { remove: false } },
			cssProcessorOptions: { discardComments: { removeAll: true }},
			canPrint: false
		}),
		// 抽离 css 到单独文件
		new ExtractTextPlugin({
			filename: 'css/[name]-[contenthash:7].css'
		}),
		// 生成 hash map
		// new HashMapPlugin({
		// 	path: path.join(__dirname, '../hash-map'), // map 文件夹路径
		// 	rotate: 10 // 保留版本记录数
		// })
	];
}else if(env === 'watchBuild' || env === 'dev'){
	config.devtool = 'source-map';
	config.plugins = [
		new CleanWebpackPlugin([ dist ]),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'js/vendor.js',
			minChunks: Infinity
		}),
		new webpack.DefinePlugin({
		  	'process.env': {
		    	NODE_ENV: JSON.stringify(env)
		  	}
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new FriendlyErrorsPlugin(),
		new ExtractTextPlugin({
			filename: 'css/[name].css'
		})
	];
	const WebpackDevServer = require("Webpack-dev-server");
	const compiler = webpack(config);
	const server = new WebpackDevServer(compiler, {
		stats: 'none',
		https:env === 'production',
		contentBase: process.cwd(),
		publicPath: config.output['publicPath']+'/',
		host: '0.0.0.0',
		disableHostCheck: true,
		compress: true, // 开启gzip压缩
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
	});
	server.listen(8880);
}
module.exports = config;