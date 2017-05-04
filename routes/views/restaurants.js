var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.filters = {
		city: req.params.city,
	};
	locals.data = {
		restaurants: []
	};


	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'restaurants';

	// Load all restaurants
	view.on('init', function (next) {

		var q = keystone.list('Restaurant').model.find();

		if (locals.filters.city) {
			q.where('location.state', locals.filters.city);
		}

		q.exec(function (err, results) {

			locals.data.restaurants = results;

			next(err);
		});

		//keystone.list('Restaurant').model.find().where('location.state', locals.filters.city).exec(function (err, results) {

			/*if (err || !results.length) {
				return next(err);
			}*/

			//locals.data.restaurants = results;

			//next(err);
		//});
	});


	// Render the view
	view.render('restaurants');
};
