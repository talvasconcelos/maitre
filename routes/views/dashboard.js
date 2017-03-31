var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'dashboard';
	locals.data = {
		reserv: [],
	};
	locals.formData = req.user

	// Load User Data
	// Load Reserves
	view.on('init', function (next) {

		keystone.list('Reserve').model.find()
		.where('user', locals.user.id)
		.populate('restaurant')
		.sort('-date')
		.exec(function(err, result) {
			if(err) return res.err(err);
			locals.data.reserv = result;
			next();
		});
	});


	// Render the view
	view.render('dashboard');
};
