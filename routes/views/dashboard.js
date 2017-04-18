var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'dashboard';
	locals.data = {
		reserv: [],
	};
	//locals.formData = req.user

	// Load User Data
	// Load Reserves
	view.on('init', function (next) {

		keystone.list('Reserve').model.find()
		.where('user', locals.user.id)
		.populate('restaurant')
		.sort('-createdAt')
		.exec(function(err, result) {
			if(err) return res.err(err);
			locals.data.reserv = result;
			next();
		});
	});

	view.on('post', { action: 'update' }, function (next) {
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name, email'
		}, function(err) {
			if (err) {
				console.log(err)
				return next();
			}
			req.flash('success', 'Your changes have been saved.');
			return next();

		})
	})

	view.on('post', { action: 'updatePassword' }, function (next) {
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Introduza uma password.');
			return next();
		}

		if (!(req.body.password === req.body.password_confirm)) {
			req.flash('error', 'As passwords não são iguais.');
			return next();
		}

		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password'
		}, function(err) {
			if (err) {
				console.log(err)
				return next();
			}
			req.flash('success', 'Your changes have been saved.');
			return next();

		})
	})


	// Render the view
	view.render('dashboard');
};
