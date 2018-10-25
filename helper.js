/**
 * Created by Raphael Edwards.
 */

var webdriver = require('selenium-webdriver');
var until = require('selenium-webdriver').until;
var assert = require('selenium-webdriver/testing/assert');
var async = require('async');
var logger = require('./log')

module.exports ={

    browser: null,

    addDriver:function(driver){
        module.exports.browser = driver;
    },

    //isElementPresent is depreciated for selenium 3.0
    elementpresent:function (type, element){
        driver.wait(function () {
            switch(type) {
                case "css":
                    return module.exports.browser.isElementPresent(webdriver.By.css(element));
                case "id":
                    return module.exports.browser.isElementPresent(webdriver.By.id(element));
                case "xpath":
                    return module.exports.browser.isElementPresent(webdriver.By.xpath(element));
                case "linkText":
                    return module.exports.browser.isElementPresent(webdriver.By.linkText(element));
                case "name":
                    return module.exports.browser.isElementPresent(webdriver.By.name(element));
                case "class":
                    return module.exports.browser.isElementPresent(webdriver.By.className(element));
                default:
                    return module.exports.browser.isElementPresent(webdriver.By.id(element));
            }
        }, timeout);
    },

    elementlocated: function (type, element) {
            switch (type) {
                case "css":
                    return module.exports.browser.wait(until.elementLocated(webdriver.By.css(element)), 5000);
                case "id":
                    return module.exports.browser.wait(until.elementLocated(webdriver.By.id(element)), 5000);
                case "xpath":
                    return module.exports.browser.wait(until.elementLocated(webdriver.By.xpath(element)), 5000);
                case "linkText":
                    return module.exports.browser.wait(until.elementLocated(webdriver.By.linkText(element)), 5000);
                case "name":
                    return module.exports.browser.wait(until.elementLocated(webdriver.By.name(element)), 5000);
                case "class":
                    return module.exports.browser.wait(until.elementLocated(webdriver.By.className(element)), 5000);
                default:
                    return module.exports.browser.wait(until.elementLocated(webdriver.By.id(element)), 5000);
            }
    },

    findelement: function (type, element){
        switch(type) {
            case "css":
                return module.exports.browser.findElement(webdriver.By.css(element));
            case "id":
                return module.exports.browser.findElement(webdriver.By.id(element));
            case "xpath":
                return module.exports.browser.findElement(webdriver.By.xpath(element));
            case "linkText":
                return module.exports.browser.findElement(webdriver.By.linkText(element));
            case "name":
                return module.exports.browser.findElement(webdriver.By.name(element));
            case "class":
                return module.exports.browser.findElement(webdriver.By.className(element));
            default:
                return module.exports.browser.findElement(webdriver.By.id(element));
        }

    },

    findelements: function (type, element){
        switch(type) {
            case "css":
                return module.exports.browser.findElements(webdriver.By.css(element));
            case "id":
                return module.exports.browser.findElements(webdriver.By.id(element));
            case "xpath":
                return module.exports.browser.findElements(webdriver.By.xpath(element));
            case "linkText":
                return module.exports.browser.findElements(webdriver.By.linkText(element));
            case "name":
                return module.exports.browser.findElements(webdriver.By.name(element));
            case "class":
                return module.exports.browser.findElements(webdriver.By.className(element));
            default:
                return module.exports.browser.findElements(webdriver.By.id(element));
        }

    },

    getTodayDate: function () {
        var date;
        date = new Date();
        date = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-'
            + ('00' + date.getDate()).slice(-2);
        return date;
    },

    getFormatedDate: function (title) {
        var date = new Date();
        date = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-'
            + ('00' + date.getDate()).slice(-2);
        return date;
    },

    getTextFromArr: function (key) {
        try {
            return module.exports.textArray[key];
        } catch (e) {
            return false;
        }
    },

    goToPreviousPage: function () {
        module.exports.browser.navigate().back();
    },

    getwindowHandle:function(){
        logger.logtoconsole("Getting current Window handle");
        module.exports.browser.getWindowHandle().then(function (Window) {
            logger.logtoconsole("Current Window Handle: " + Window);
            return Window
        }, function(err){
            logger.logtoconsole(err)
        })
    },

    getAttributeValue: function (xpath, orderid, label, is_compulsory) {
        if (typeof (is_compulsory) == 'undefined') {
            is_compulsory = true;
        }

        module.exports.browser.isElementPresent(webdriver.By.xpath(xpath)).then(function (present) {
            if (present) {
                loggs.logtoconsole(label + " found");
                return module.exports.browser.findElement(webdriver.By.xpath(xpath)).getAttribute(orderid).then(function (val) {
                    loggs.logtoconsole(orderid + " is: " + val);
                    return module.exports.attArray[xpath] = val;
                });
            } else {
                if (is_compulsory == true) {
                    module.exports.failroutine(present, label + ' not found');
                }
            }
        });
    },

    parent: function (elem, label) {
        elem.isElementPresent(webdriver.By.xpath('..')).then(function (present) {
            if (present) {
                return elem.findElement(webdriver.By.xpath('..'));
            } else {
                logs.assertTrue(label,'not present',present);
            }
        });
    },

    getRandomElement: function (list) {
        if (list == undefined)
            return;
        var pickone = list[Math.floor(Math.random() * list.length)];
        if (pickone == undefined)
            return;
        return pickone;
    },

    shufflearray: function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick one of the remaining elements...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    getRandomNumber: function (number) {
        var result = Math.floor((Math.random() * number) + 1);
        return result;
    },

    getMysqlDate: function () {
        var date;
        date = new Date();
        date = date.getFullYear() + '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' +
            ('00' + date.getMinutes()).slice(-2) + ':' +
            ('00' + date.getSeconds()).slice(-2) + ':' +
            ('000' + date.getMilliseconds()).slice(-3);

        return date;
    },

    setStartTime: function (start_time) {
        module.exports.start_time = start_time;
    },

    getWindowHandles : function(cb){
        module.exports.browser.sleep(60000)
        logs.logtoconsole("Getting all Window handles");
        module.exports.browser.getAllWindowHandles().then(function (Window) {
            logs.logtoconsole("All Window Handles: " + Window);


            cb(null,Window)
        },function (err) {
            logs.errorroutine(err);
        })
    },

    switchto :function(state,window){
       module.exports.browser.sleep(60000)
        logs.logtoconsole(" Window Handles:" + window)

        switch(state){
            case'current':
                win =window[1]
            case 'main':
                win =window[0]
            case 'default':
                win =window


                logs.logtoconsole(" Win Handles:" + win)
                module.exports.browser.switchTo().window(win).then(function (Switch){
                    logs.logtoconsole("trying to switch to prod window");
                    val.validatcurrwindowHandle(window)

                },function(err){
                    logs.errorroutine(err)
                })
        }
    }
}