var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

  res.cookie('maitrelang', req.params.lang, {maxAge: 900000, httpOnly: true})

	res.redirect(req.body.target || '/');
};
