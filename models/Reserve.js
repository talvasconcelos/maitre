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
   createdAt: { type: Date, default: Date.now },
   user: { type: Types.Relationship, ref: 'User', index: true },
   party: {type: Types.Number},
   restaurant: { type: Types.Relationship, ref: 'Restaurant', index: true },
   response: { type: Boolean },
   endedAt: { type: Date, default: '' }
 });

 Reserve.defaultSort = '-createdAt';
 Reserve.defaultColumns = 'user, restaurant, createdAt';
 Reserve.register();
