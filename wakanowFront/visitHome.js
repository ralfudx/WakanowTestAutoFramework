//Visit Wakanow home page
var wakanow = require('wakanow');
var data = wakanow.confData;
var test = wakanow.runner;

test.describe('Sanity Tests-Wakanow', function() {
	test.beforeEach(function() {
		wakanow.openbrowser();
		//wakanow.gettestname(this.currentTest.title,this.currentTest.parent.title);
	});
	test.it('Visit home page and check page title', function() {
		wakanow.openurl(data.home.wakaurl, data.home.wakapagetitle);
		wakanow.hitlogin(data.login.loginpagetitle, data.type.id, data.login.accounttabxpath,
			data.login.accounttablabel, data.type.xpath, data.login.logintabxpath, data.login.logintablabel);
		/**wakanow.felogin(data.type.css, data.login.css, data.login.label, data.type.id, data.login.stagPageTitle,
			data.login.emailid, data.login.email, data.login.passwordid, data.login.password,
			data.login.submitid, data.myacct.acctId, data.myacct.acctLinkText);*/

	});
	test.after(function() {
		//wakanow.closebrowser(this.test.parent.tests[0],this.currentTest.title);
	});
});
