var keystone = require('keystone');
var moment = require('moment');
var Rest = keystone.list('Restaurant');

moment.locale('pt');

moment.updateLocale('pt', {
    calendar : {
        sameDay : '[Hoje,] DD MMMM',
        nextDay : '[Amanha,] DD MMMM'
    }
});


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.dates = {
		pretty: [],
		ugly: [],
    intervals: []
	};
	// locals.filters = {
	// 	rest: req.params.rest,
	// };


	// Load the current restaurant
	/*view.query('restaurants', keystone.list('Restaurant').model.findOne({
			key:
		})
	);*/
	view.on('init', function (next) {

		Rest.model.findOne()
		.where('key', req.params.rest)
		.exec(function(err, rest) {
			if(err) return res.err(err);
			locals.rest = rest;
			next();
		});
	});

	view.on('init', function (next) {
		var range = 9;
		var today = Date.now();
		for (var i = 0; i < range; i++) {
			var x = moment();
			x.add(i, 'day');
			locals.dates.ugly.push(x.format('L'));
			if (i < 2) {
			 locals.dates.pretty.push(moment(x).calendar(today));
			} else {
				locals.dates.pretty.push(moment(x).format('dddd, DD MMMM'));
			};
		}
    var start = new Date;
    start.setHours(11,30)
    var temp = [];
    for (var i = 0; i < 24; i++) {
      temp[i] = moment(start)
      start = moment(start).add(30, 'minutes')
    }
    locals.dates.intervals = temp
		next();
	});

	// Render the view
	view.render('restaurant');
};
