//Visit Wakanow home page validate banners are displayed and not broken then click banner 1
//validate redirect to banner page
//validate other banners are displayed and not broken

var wakanow = require('wakanow');
var data = wakanow.confData;
var test = wakanow.runner;

test.describe('Sanity Tests-Wakanow click banner 1', function() {
	test.beforeEach(function() {
		wakanow.openbrowser();
	});
	test.it('Visit home page and validate banner 1', function() {
		wakanow.openurl(data.home.wakaurl, data.home.wakapagetitle);
		wakanow.checkhomebanner(data.type.xpath, data.images.homeimage1xpath, data.images.homewidth,
			data.images.homeheight, data.images.homeimage1ptitle);
	});
	test.after(function() {
		wakanow.closebrowser();
	});
});
