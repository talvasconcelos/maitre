var keystone = require('keystone');
var Email = require('keystone-email');
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

	view.on('post', {action: 'reserve'}, function (next) {
		// handle form
		var info = {
			username: locals.user.name.full,
			restname: locals.formData.restName,
			restemail: locals.formData.restEmail
		};
		var newReserve = new Reserve.model({
			user: locals.user.id,
			party_size: locals.formData.party_size,
			date: locals.date,
			restaurant: locals.formData.restaurant
		});

		newReserve.save((err, newReserve) => {
			if (err) return console.error(err);
			newReserve.notifyRestaurant(info);
		});

		return res.redirect('/dashboard#reserves');
		next();

});

	// On POST requests, add the Enquiry item to the database
	/*view.on('post', { action: 'reserve' }, function (next) {

		var newReserve = new Reserve.model({
			user: locals.user.id,
			party_size: locals.formData.party_size,
			date: locals.date,
			restaurant: locals.formData.restaurant,
			restContact: new Date()
		});


		var updater = newReserve.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			//fields: 'state',
			errorMessage: 'There was a problem submitting your Reserve:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				//Send email to restaurant
				new Email('test/test-email.pug', {
					transport: 'mailgun'
				}).send({
					firstName: 'Tiago',
					name: 'Vasconcelos',
					restName: locals.formData.restName,
					party: locals.formData.party_size,
					day: locals.formData.day,
					hour: locals.formData.hour,
					reserveID: newReserve.id
				}, {
					apiKey: process.env.MAILGUN_API_KEY,
				    domain: process.env.MAILGUN_DOMAIN,
				    to: 'talvasconcelos@gmail.com',
				    from: {
				        name: 'Maitre',
				        email: 'info@maitre.pt',
				    },
				    subject: 'Reserva Maitre no ' + locals.formData.restName,
				}, function (err, result) {
				    if (err) {
				        console.error('🤕 Mailgun test failed with error:\n', err);
				    } else {
				        console.log('📬 Successfully sent Mailgun test with result:\n', result);
				        //newReserve.restContact = new Date();
				    }

				});

				//redirect user
				return res.redirect('/');
			}
			next();
		});
	});*/

	view.render('reserve');
};
