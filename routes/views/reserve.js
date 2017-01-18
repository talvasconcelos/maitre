var keystone = require('keystone');
var Reserve = keystone.list('Reserve');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.filters = {
		rest: req.params.rest,
	};
	locals.formData = req.body || {};
	locals.reserveSubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'reserve' }, function (next) {

		var newReserve = new Reserve.model();
		var updater = newReserve.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, reserveType, message',
			errorMessage: 'There was a problem submitting your Reserve:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.reserveSubmitted = true;
			}
			next();
		});
	});

	view.render('reserve');
};
