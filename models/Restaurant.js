var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Restaurant Model
 * =============
 */

var Restaurant = new keystone.List('Restaurant', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Restaurant.add({
	name: { type: String, required: true, index: true },
	contact: {
		email: { type: Types.Email, initial: true, required: true, index: true, unique: true },
		name: { type: String, initial: true, required: true, index: true },
		phone: { type: Types.Number}
	},
	description: {type: Types.Html, wysiwyg: true, height: 150},
	cost_for_two: {type: Number, initial: true},
	cuisines: {type: String, initial: true},
	feature: {type: Types.Boolean, index: true},
	location: {type: Types.Location, enableMapsAPI:true, defaults: { country: 'Portugal' }},//{type: Types.Location, enableMapsAPI:true},
	//thumb: {},
	//avatar: {},
	image: { type: Types.CloudinaryImage },
	singular: {
		chef: {type: String, initial: true, label: 'Chef'},
		awards: {type: String, initial: true, label: 'Prémios'},
		signatureDish: {type: String, initial: true, label: 'Pratos'}
	},
	publishedDate: { type: Types.Date, default: Date.now, noedit: true }

});

Restaurant.register();
