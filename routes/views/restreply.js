const keystone = require('keystone');
const Reserve = keystone.list('Reserve');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
	var locals = res.locals;

  locals.submited = false;

  view.on('init', function(next) {
    if (locals.submited) return next();
    Reserve.model.findOne()
      .where('reservLink', req.params.key)
      .populate('user')
      .populate('restaurant')
      .exec(function(err, reserve) {
        if (err) return next(err);
        if (!reserve) {
          req.flash('error', 'Pedimos desculpa mas esta reserva já não está activa.');
        }
        locals.found = reserve;
        next();
    });
  });

  view.on('post', {action: 'restreply.confirm'}, function(next) {
    locals.found.state = 'confirmed';
    locals.found.reservLink = '';
    locals.found.restResponse.confirm = true;
    locals.found.restResponse.date = new Date();
    var info = {
      user: locals.found.user.name.full,
      usermail: locals.found.user.email,
      restaurant: locals.found.restaurant.name
    };
    locals.found.save(function(err) {
      if (err) return next(err);
    })
    locals.submited = true;
    req.flash('success', 'A reserva foi confirmada, vamos agora notificar o cliente. Obrigado pela sua disponibilidade.');
    locals.found.notifyUser(info);


    return next();
  })

  view.on('post', {action: 'restreply.reject'}, function(next) {
    locals.found.state = 'denied';
    locals.found.reservLink = '';
    locals.found.restResponse.confirm = false;
    locals.found.restResponse.date = new Date();
    var info = {
      user: locals.found.user.name.full,
      usermail: locals.found.user.email,
      restaurant: locals.found.restaurant.name
    };
    locals.found.save(function(err) {
      if (err) return next(err);
    })
    locals.submited = true;
    req.flash('warning', 'A reserva foi rejeitada, vamos agora notificar o cliente. Obrigado pela sua disponibilidade.');
    locals.found.notifyUser(info);


    return next();
  })

  view.render('restreply');
}
