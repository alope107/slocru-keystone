var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Summer Mission Model
 * ==========
 */

var SummerMission = new keystone.List('SummerMission', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

SummerMission.add({
	name: { type: String, required: true, initial: true },
	description: { type: Types.Textarea, initial: true },
	image: { type: Types.S3File,
           required: false,
           allowedTypes: [
             'image/png',
             'image/jpeg',
             'image/gif'
           ],
           s3path: process.env.IMAGE_ROOT_PATH + '/summer-missions',
           //  function with arguments current model and client file name to return the new filename to upload.
           filename: function(item, filename, originalname) {
		         // prefix file name with object id
		         return item.slug + '-image.' + originalname.split('.')[1].toLowerCase();
	         },
           headers: function(item, file) {
		         var headers = {};
		         headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
		         return headers;
	         },
           format: function(item, file) {
		         return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
					     '<img src="' + file.url + '" style="max-width: 300px">';
	         }
  },
  imageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      console.log(this.image.url);
      return 'https:' + this.image.url;
    },
    format: function(url) {
      console.log(url);
      return url;
    }
  },
	groupImage: { type: Types.S3File,
           required: false,
           allowedTypes: [
             'image/png',
             'image/jpeg',
             'image/gif'
           ],
           s3path: process.env.IMAGE_ROOT_PATH + '/summer-missions',
           //  function with arguments current model and client file name to return the new filename to upload.
           filename: function(item, filename, originalname) {
		         // prefix file name with object id
		         return item.slug + '-group-photo.' + originalname.split('.')[1].toLowerCase();
	         },
           headers: function(item, file) {
		         var headers = {};
		         headers['Cache-Control'] = 'max-age=' + moment.duration(1, 'month').asSeconds();
		         return headers;
	         },
           format: function(item, file) {
		         return '<pre>' + JSON.stringify(file, false, 2) + '</pre>' +
					     '<img src="' + file.url + '" style="max-width: 300px">';
	         }
  },
  groupImageLink: {
    type: Types.Url,
    hidden: false,
    noedit: true,
    watch: true,
    value: function() {
      console.log(this.teamImage.url);
      return 'https:' + this.teamImage.url;
    },
    format: function(url) {
      console.log(url);
      return url;
    }
  },
  url: { type: Types.Url },
  location: { type: Types.Location, initial: true, required: true, defaults: { country: 'USA' } },
	startDate: { type: Types.Date, format: 'MMM Do YYYY', default: Date.now, required: true, initial: true },
  endDate: { type: Types.Date, format: 'MMM Do YYYY', default: Date.now, required: true, initial: true },
	leaders: { type: Types.Text, note: 'For multiple leaders, separate names with commas' },
	cost: { type: Types.Money, initial: true }
});

SummerMission.defaultColumns = 'name, location, startDate, endDate';
SummerMission.register();
