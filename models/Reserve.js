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
    createdAt: { type: Date, default: Date.now },    
    endedAt: { type: Date },
    party_size: {type: Types.Number},
    date: {type: Date},
    restaurant: { type: Types.Relationship, ref: 'Restaurant', index: true },
}, 'State', {
    state: { type: Types.Select, options: 'null, sent, confirmed, denied, ended', noedit: true },
    restResponse: {
        confirm: {type: Types.Boolean},
        date: {type: Date}
    },
    
 });




 Reserve.defaultSort = '-createdAt';
 Reserve.defaultColumns = 'user, restaurant, createdAt, response';
 Reserve.register();
