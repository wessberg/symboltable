module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"parser": "babel-eslint",
	"plugins": ["babel", "flowtype"],
	"parserOptions": {
		"ecmaVersion": 7,
		"sourceType": "module",
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true,
			"impliedStrict": true
		}

	},
	"rules": {
		"linebreak-style": [
			"error",
			"unix"
		],
		"semi": [
			"error",
			"always"
		],
		"no-var": "error",
		"no-constant-condition": 0,
		"require-yield": 0,
		"no-useless-constructor": "error",
		"no-use-before-define": [2, { "functions": true, "classes": true }],
		"spaced-comment": ["error", "always"],
		"semi-spacing": ["error", {"before": false, "after": true}],
		"no-fallthrough": 0,
		"no-console": 0,
		"no-case-declarations": 0,
		"no-mixed-spaces-and-tabs": "error",
		"no-const-assign": "error",
		"no-dupe-class-members": "error",
		'no-with': "error",
		"no-eval": "error",
		"no-alert": "error",
		"no-redeclare": "error",
		"guard-for-in": "error",
		"no-this-before-super": "error",
		"no-duplicate-imports": "error",
		"no-class-assign": "error",
		"require-jsdoc": ["error", {
			"require": {
				"FunctionDeclaration": true,
				"MethodDefinition": true,
				"ClassDeclaration": true
			}
		}],
		"prefer-template": "error",
		"quote-props": ["error", "consistent-as-needed", { "keywords": true }],
		"object-shorthand": ["error", "always"],
		"prefer-rest-params": "error",
		"arrow-body-style": ["error", "as-needed"],
		"arrow-parens": ["error", "as-needed"],
		"dot-notation": ["error", {"allowPattern": "^[a-z]+(_[a-z]+)+$" }],
		"eqeqeq": ["error", "smart"],
		"quotes": [2, "double", {
			avoidEscape: true,
			allowTemplateLiterals: true
		}],
		"flowtype/define-flow-type": 1,
		"flowtype/use-flow-type": 1,
		"flowtype/valid-syntax": 1
	},
	"globals": {
		"process": false,
		"css": false,
		"html": false,
		"assert": false,
		"it": false,
		"__dirname": false,
		"beforeEach": false,
		"describe": false,
		"context": false,
		"require": false,
		"define": false
	},
	"settings": {
		"flowtype": {
			"onlyFilesWithFlowAnnotation": false
		}
	}
};
