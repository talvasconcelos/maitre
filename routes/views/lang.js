var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
  console.log(req.params.lang) //en
  console.log(locals.locale) //pt
  console.log(res.getLocale()) //pt
  console.log(req.cookies.language) //en

  res.cookie('language', req.params.lang)

  console.log(req.cookies.language)

	res.redirect('/');
};
