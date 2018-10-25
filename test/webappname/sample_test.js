/**
 * Created by Raphael Edwards.
 */

var softbilling = require('../../framework/webappname.js');
var config = require('../../dataconfig');
var data = config.confData;
var test = require('selenium-webdriver/testing');
var framework = require('../../action.js');
var logs = require('../../log.js');

test.describe('Sample_Test_Suite', function() {

    test.beforeEach(function () {
        framework.launchBrowser();
        logs.gettestname(this.currentTest.title, this.currentTest.parent.title);
    });
    test.it('Sample_TestCase', function () {
        framework.openURL(data.homepage['gmailurl'], data.homepage['gmailtitle']);
    });
    test.afterEach(function () {
        framework.closeBrowser();
    });
});