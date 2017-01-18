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
	description: {type: Types.Textarea, initial: true },
	cost_for_two: {type: Number, initial: true},
	cuisines: {type: String, initial: true},
	/*location: {
		city: { type: String, initial: true, required: true, index: true },
		address: { type: String, initial: true, required: true, index: true },
		coord: {
			long: { type: Types.Number},
			lat: { type: Types.Number}
		}
	},*/
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
