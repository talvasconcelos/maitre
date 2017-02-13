var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	//locals.filter = [];


	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Load the posts
	view.query('restaurants', keystone.list('Restaurant').model.find());
	
	// Render the view
	view.render('index');
};
