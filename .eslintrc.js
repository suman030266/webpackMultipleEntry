module.exports = {
	root: false,
	parser: 'babel-eslint',
	extends: 'eslint:recommended',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
		node: true,
		commonjs: true,
		es6: true,
		jquery: true
	},
	globals: {

	},
	rules: {
		semi: ['error', 'always'],
		'space-before-function-paren': ['error', 'never'],
		'no-console': 'off',
		'no-unused-vars': 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
}
