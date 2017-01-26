var keystone = require('keystone');
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
    party_size: {type: Types.Number},
    date: {type: Date},
    restaurant: { type: Types.Relationship, ref: 'Restaurant', index: true },
}, 'State', {
    createdAt: { type: Date, default: Date.now },   
    submitted: {type: Boolean},
    response: { type: Boolean },
    confirmed: {type: Boolean},
    endedAt: { type: Date, default: '' }
 });

 Reserve.defaultSort = '-createdAt';
 Reserve.defaultColumns = 'user, restaurant, createdAt, response';
 Reserve.register();
