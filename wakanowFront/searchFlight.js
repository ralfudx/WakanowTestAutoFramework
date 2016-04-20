//Visit Wakanow home page and then search for flight
var wakanow = require('wakanow');
var data = wakanow.confData;
var test = wakanow.runner;

test.describe('Sanity Tests-Wakanow flight search', function() {
	test.beforeEach(function() {
		wakanow.openbrowser();
	});
	test.it('Visit home page and search for flight', function() {
		wakanow.openurl(data.home.wakaurl, data.home.wakapagetitle);
		wakanow.searchflight(data.type.id, data.type.xpath, data.flightsearch.roundtripid, data.flightsearch.flyingfromid,
			data.flightsearch.flyingfromcity, data.flightsearch.flyingtoid, data.flightsearch.flyingtocity, data.flightsearch.ticketclassid,
			data.flightsearch.tcoption1xpath, data.flightsearch.departdateid, data.flightsearch.monthxpath,
			data.flightsearch.departdatexpath, data.flightsearch.returndateid, data.flightsearch.returndatexpath,
			data.flightsearch.yearxpath, data.flightsearch.adultsid, data.flightsearch.adultoption1xpath, data.flightsearch.childrenid,
			data.flightsearch.childoption1xpath, data.flightsearch.infantid, data.flightsearch.infantoption1xpath, data.flightsearch.searchbutid);
		wakanow.valflightsearch(data.flightsearch.searchpagetitle, data.type.id, data.type.xpath, data.flightsearch.changebutid,
			data.flightsearch.ticketclassxpath, data.flightsearch.ticketclass);
	});
	test.after(function() {
		//wakanow.closebrowser();
	});
});
