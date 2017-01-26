var keystone = require('keystone');
var Reserve = keystone.list('Reserve');
var moment = require('moment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.filters = {
		rest: req.params.rest,
	};
	locals.formData = req.body || {};
	locals.reserveSubmitted = false;
	locals.date = moment(locals.formData.day, 'DD-MM-YYYY').hours(locals.formData.hour);


	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'reserve' }, function (next) {

		var newReserve = new Reserve.model({
			user: locals.user.id,
			party_size: locals.formData.party_size,
			date: locals.date,
			restaurant: locals.formData.restaurant
		});

		locals.reserveSubmitted = true;

		var updater = newReserve.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: '',
			errorMessage: 'There was a problem submitting your Reserve:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.reserveSubmitted = true;
				return res.redirect('/');
			}
			next();
		});
	});

	view.render('reserve');
};
