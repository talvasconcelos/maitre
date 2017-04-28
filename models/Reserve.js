var keystone = require('keystone');
var Email = require('keystone-email');
var moment = require('moment');
var Types = keystone.Field.Types;

/**
 * Reservation Model
 * =============
 */
 var Reserve = new keystone.List('Reserve', {
    nocreate: true,
    noedit: true,
 });

 Reserve.add({
    user: { type: Types.Relationship, ref: 'User', index: true },
}, 'Details', {
    createdAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    party_size: {type: Types.Number},
    date: {type: Date},
    restaurant: { type: Types.Relationship, ref: 'Restaurant', index: true },
    reservLink: { type: String, hidden: true }
}, 'State', {
    state: { type: Types.Select, options: 'null, sent, confirmed, denied, ended', noedit: true },
    restResponse: {
        confirm: {type: Types.Boolean},
        date: {type: Date}
    },

 });

// Pre Save
// ------------------------------
Reserve.schema.pre('save', function(next) {
  var reserve = this;
  if (moment().isAfter(moment(reserve.date))) {
    reserve.state = 'ended';
    reserve.endedAt = reserve.date;
  }
  next();
})

Reserve.schema.methods.notifyRestaurant = function(info, callback) {
  var reserve = this;
  reserve.reservLink = keystone.utils.randomString([16,24]);
  reserve.state = 'sent';
  reserve.save(function(err) {
  if (err) return callback(err);
  new Email('templates/email/reserve_rest.pug', { transport: 'mailgun' })
    .send({
      user: info.username,
      restname: info.restname,
      attendees: reserve.party_size,
      date: reserve.date,
      id: reserve.id,
      responselink: 'http://beta.maitre.pt/restreply/' + reserve.reservLink
    }, {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      to: info.restemail,
      //to: 'talvasconcelos@gmail.com',
      from: {
        name: 'Maître',
        email: 'info@maitre.pt'
      },
      subject: 'Reserva Maître (id:' + reserve.id + ')',
      'o:tracking-clicks': 'no'
    }, function (err, result) {
      err ? console.error('🤕 Mailgun test failed with error:\n', err) : console.log('📬 Successfully sent Mailgun email to\n' + info.restemail + '\nwith result:\n', result);
    });
  });
}

Reserve.schema.methods.notifyUser = function(info, callback) {
  var reserve = this;
  var template = reserve.restResponse.confirm ? 'templates/email/reserve_confirm.pug' : 'templates/email/reserve_denied.pug';
  var sub = reserve.state === 'confirmed' ? 'confirmada.' : 'negada.';
  new Email(template, { transport: 'mailgun' })
    .send({
      username: info.user,
      restname: info.restaurant,
      attendees: reserve.party_size,
      date: reserve.date
    }, {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      to: info.usermail,
      //to: process.env.NODE_ENV !== 'production' ? 'talvasconcelos@gmail.com' : info.usermail,
      from: {
        name: 'Maître',
        email: 'info@maitre.pt'
      },
      subject: 'Reserva Maître (id:' + reserve.id + ') ' + sub,
      'o:tracking-clicks': 'no'
    }, function (err, result) {
      err ? console.error('🤕 Mailgun test failed with error:\n', err) : console.log('📬 Successfully sent Mailgun email with result:\n', result);
    });
}




 Reserve.defaultSort = '-createdAt';
 Reserve.defaultColumns = 'user, restaurant, createdAt, state';
 Reserve.register();
