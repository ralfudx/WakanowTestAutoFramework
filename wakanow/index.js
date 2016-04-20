var config = require('./dataconfig');
var common = require('./wakanow');
var logg = require('./createlogs');
var test = require('selenium-webdriver/testing');

module.exports = {

    advancedsearch:common.advancedsearch,
    checkhomebanner : common.checkhomebanner,
    clearandsendkeys : common.clearandsendkeys,
    closebrowser:common.closebrowser,
    confData:config.confData,
    getFormatedDate:common.getFormatedDate,
    getMysqlDate:common.getMysqlDate,
    hitlogin:common.hitlogin,
    login:common.login,
    loginadmin:common.loginadmin,
    openbrowser:common.openbrowser,
    openmultiplebrowser:common.openmultiplebrowser,
    openurl:common.openurl,
    processCSVFile:common.processCSVFile,
    processLGACSVFile:common.processLGACSVFile,
    processmultilineCSVFile:common.processmultilineCSVFile,
    processURLCSVFile:common.processURLCSVFile,
    runner:test,
    sampleTest:common.sampleTest,
    searchflight:common.searchflight,
    valflightsearch:common.valflightsearch,
    validatepagetitle:common.validatepagetitle


}


