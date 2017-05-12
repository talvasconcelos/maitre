// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
};

// Require keystone
var keystone = require('keystone');
var path = require('path');
var i18n = require('i18n');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'maitre-api',
	'brand': 'Maitre',

	//'sass': 'public',
	'static': ['public', 'app_client/public'],
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',
	'dest': '/public',

	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',

	/*'port': process.env.PORT || 3000,
	'ssl port': process.env.SSLPORT || 8001,
	ssl: 'force',
	letsencrypt: (process.env.NODE_ENV === 'production') && {
		email: 'geral@glowingturtle.pt',
		domains: ['beta.maitre.pt', 'www.maitre.pt', 'maitre.pt'],
		register: true,
		tos: true
	}*/

});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	moment: require('moment'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	host: (function () {
		if (keystone.get('env') === 'staging') return 'http://whispering-ravine-32550.herokuapp.com';
		if (keystone.get('env') === 'production') return 'http://www.maitre.pt';
		return (keystone.get('host') || 'http://localhost') + ':' + (keystone.get('port') || '8000');
	})()
});

// Configure i18n
i18n.configure({
	locales:['en', 'pt', 'de', 'fr'],
	directory: __dirname + '/locales',
	objectNotation: true,
	defaultLocale: 'pt'
});



keystone.set('cloudinary config', process.env.CLOUDINARY_URL);

keystone.set('google api key', process.env.GOOGLE_BROWSER_KEY);

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	reserves: 'reserves',
	enquiries: 'enquiries',
	users: 'users',
	restaurants: 'restaurants'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
