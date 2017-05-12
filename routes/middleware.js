/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var path = require('path');
var keystone = require('keystone');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		//{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		//{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Contactos', key: 'contact', href: '/contact' },
	];
	res.locals.user = req.user;
	next();
};

exports.detectLang = function(req, res, next) {
    //var match = req.url.match(/^\/(de|en)([\/\?].*)?$/i);

		res.setLocale('pt')

    // if (match) {
    //     req.setLocale(match[1]);
    //     // Make locale available in template
    //     // (necessary until i18n 0.6.x)
    //     res.locals.locale = req.getLocale();
    //     // reset the URL for routing
    //     req.url = match[2] || '/';
    // } (else) {
    //     // Here you can redirect to default locale if you want
    // }

    next();
}


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Tem que estar logado para aceder.');
		res.redirect('/signin');
	} else {
		next();
	}
};


exports.reactClient = function(req, res) {
	res.sendFile(path.resolve('app_client/index.html'));
}
