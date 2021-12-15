module.exports = {
	'env': {
		'browser': true,
		'es6': true,
		'jest/globals': true ,
		'cypress/globals': true
	},
	'extends': [ 
		'eslint:recommended',
		'plugin:react/recommended'
	],
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'react', 'jest',  'cypress'
	],
	'rules': {
    
		'react/react-in-jsx-scope': 'off',      
		'eqeqeq': 'error',
		'react/display-name': 'off',
     
		'arrow-spacing': [
			'error', { 'before': true, 'after': true }
		],
		'no-console': 0,
		'react/prop-types': 0
	},
	'settings': {
		'react': {
			'version': 'detect'
		}
	}
};