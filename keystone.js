// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
};

// Require keystone
var keystone = require('keystone');
var path = require('path');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'maitre-api',
	'brand': 'Maitre',

	'sass': 'public',
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

	//'port': process.env.PORT || 3000

});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	react: path.resolve('app_client/index.html')
});

keystone.set('cloudinary config', process.env.CLOUDINARY_URL);

keystone.set('google api key', process.env.GOOGLE_BROWSER_KEY);

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	galleries: 'galleries',
	enquiries: 'enquiries',
	users: 'users',
	restaurants: 'restaurants'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
