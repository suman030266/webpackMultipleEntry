const path = require('path'),
    join = path.join;
const contentBase = process.cwd(),
// const contentBase = __dirname,
	src = join(contentBase, 'src'),
	paths = {
		base: contentBase,
		src,
		dist: join(contentBase, 'dist'),
		view: join(contentBase, 'view'),
		js: join(src, 'js'),
		page: join(src, 'js/page'),
		common: join(src, 'common'),
		components: join(src, 'components'),
		css: join(src, 'css'),
		io: join(src, 'io'),
		mods: join(src, 'mods'),
		widgets: join(src, 'widgets'),
		util: join(src, 'util'),
		vendor: join(src, 'vendor'),
		plugin: join(src, 'plugin')
    };
module.exports = paths;