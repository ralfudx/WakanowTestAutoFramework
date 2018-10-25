/**
 * Created by Raphael Edwards.
 */

/*Common actions used by all product frameworks*/

var webdriver = require('selenium-webdriver');
var until = require('selenium-webdriver').until;
var async = require('async');
var config = require('./dataconfig');
var data = config.confData;
var driver;
var log = require('./log');
var util =require('./helper');

module.exports = {

    browsername: null,

    launchBrowser: function (browser) {

        if (typeof (browser) === 'undefined') { // initialize if driver variable
            browser = data.default_browser;
        }

        module.exports.browsername = browser;

        var selenium_address = 'http://' + ("localhost" || "52.214.205.71") + ':' + 4444 + '/wd/hub';

        driver = new webdriver.Builder().usingServer(selenium_address).withCapabilities({'browserName': browser}).build();

        //driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities({'browserName': browser}).build();

        util.addDriver(driver);
        log.addDriver(driver);

        driver.manage().deleteAllCookies();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(120000);
    },

    openURL: function (url, title) {
        //driver.manage().timeouts().pageLoadTimeout(120000);
        log.logtoconsole("Loading page...");

        driver.get(url).then(function () {}, function (err) {
            log.logtoconsole("Page did not load fully: " + err.state);
        });

        //driver.manage().timeouts().implicitlyWait(20000);
        module.exports.validatePageTitle(title);
    },

    closeBrowser: function (results, title) {
        driver.wait(function(){
            console.log("Quitting browser...")

            driver.quit();
            return true;
        }, 10000000)
    },

    openNewWindow: function () {
        var script = "window.open()";
        driver.executeScript(script);
    },

    waitUntilLoadingComplete: function (loaderxpath) {
        var elem = driver.findElement(webdriver.By.xpath(loaderxpath));
        driver.wait(until.elementIsNotVisible(elem));
    },

    clickElement: function (type, element, label) {
        module.exports.validateelementlocated(type, element, label);
        util.findelement(type, element).click().then(function () {
            log.logtoconsole(label+' clicked!')
            //driver.manage().timeouts().implicitlyWait(100000)

        }, function (err) {
            log.errorroutine(err);
        });

    },

    presskey: function(type, element, label, key){
        module.exports.validateelementpresent(type, element, label)
        util.findelement(type, element).sendKeys(key).then(function () {
            log.logtoconsole('ENTER key pressed on ' + label)

        }, function (err) {
            log.errorroutine(err);
        });
    },

    getText: function (type, element, label, callback) {
        var name;
        module.exports.validateelementpresent(type, element, label)
        util.findelement(type, element).getText().then(function(Text){
            log.logtoconsole(label+'  is = '+Text)
            name =Text
            callback(null, name)
        },function(err){
            log.errorroutine(err);
        })
    },

    waitbeforeaction: function (ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    getCurrentDateTime: function () {
        var currentdate = new Date();
        return datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + "_"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
    },

    getCurrentDateTimeString: function () {
        var currentdate = new Date();
        return datetime = currentdate.getDate() + ""
            + (currentdate.getMonth() + 1) + ""
            + currentdate.getFullYear() + ""
            + currentdate.getHours() + ""
            + currentdate.getMinutes() + ""
            + currentdate.getSeconds();
    },

    generateRandomEmail: function (firstname, lastname) {
        var randemail = (firstname + "." + lastname + "_" + module.exports.getCurrentDateTimeString() + "@gmail.com");
        log.logtoconsole("Generated email is: " + randemail);
        return randemail;
    },

    clickallmenuitems: function (type, number, parentelem, childelem, title, text) {
        var i;
        for (i = 2; i < number; i++) {
            if (i > 8) {
                module.exports.scrollToEnd();
            }
            var element = (parentelem + i.toString() + childelem);
            //Todo:: get text and pass to clickelement function
            //var label = util.findelement(type, element).getText();
            if (i != 16) {
                module.exports.clickElement(type, element);
                //Todo:: validate each item
                if (i == 2) {
                    util.goToPreviousPage();
                }
                //Todo:: validate pagetitle
                //module.exports.validatePageTitle(title);
            }
        }
    },

    selectDropdownOption: function (type, element, label, value) {
        module.exports.validateelementlocated(type, element, label);
        //Select dropdown = new Select(util.findelement(type, element));
        //dropdown.SelectByValue(value);
    },

    //Use this function to send keys with any selector
    enterText: function (type, element, label, text) {
        module.exports.validateelementlocated(type, element, label);
        util.elementlocated(type, element).sendKeys(text).then(function () {
            log.logtoconsole('\"'+text+'\"' +' entered into '+label)
        },
            function(err){
                log.errorroutine(err);
            });
    },

    acceptAlert: function () {
        driver.switchTo().alert().accept();
    },


    //send keys
    sendKeys: function (type, element, label, text) {
        return util.elementlocated(type, element).then(el => {
            return el.sendKeys(text);
        });
    },

    //Use this function to clear keys with any selector
    clearkeys: function (type, element, label) {
        module.exports.validateelementpresent(type, element, label);
        util.findelement(type, element).clear().then(function(){
                log.logtoconsole(label+ ' cleared')

            },
            function(err){
                log.errorroutine(err)
            });
    },

    //Use this function to clear text and send keys with any selector
    clearandenterText: function (type, element, label, text) {
        async.series([function (cb) {

           module.exports.clearkeys(type, element, label)
           cb(null, module.exports.enterText(type, element, label, text))

        }], function (err, result) {

            if(err) {
                log.errorroutine(err);
            }
        });
    },

    getAttributeValue: function (xpath, orderid, label, callback) {

        is_compulsory = true;

        driver.isElementPresent(webdriver.By.xpath(xpath)).then(
            function (present) {
                if (present) {
                    console.log(label + " found");
                    return driver.findElement(webdriver.By.xpath(xpath)).getAttribute(orderid)
                        .then(function (val) {
                            console.log(orderid + " is: " + val);
                            module.exports.attArray[xpath] = val;
                            callback()
                        });
                } else {
                    if (is_compulsory == true) {
                        console.log(label + ' not found');
                        module.exports.takescreenshot();
                        module.exports.logtoFile(label + ' not found');
                        assert(present).isTrue();
                        return false;
                    }
                }
            });
    },

    //Request focus on element that are not clickable and click on them
    requestFocusAndPressEnter: function (type, element, label) {
        async.series([
            /*function (callback) {
                module.exports.enterText(type, element, label, '');
                callback();
            },*/
            function (callback) {
                //module.exports.clickElement(type, element, label);
                module.exports.presskey(type, element, label, webdriver.Key.ENTER);
                callback();
            }], 
            function (err, result) {
                if (err) {
                    log.errorroutine(err);
                }
            }
        );
    },

    //Use this function to move mouse to element with any selector
    mousemovetoelement: function (type, element, label) {

            module.exports.validateelementpresent(type, element, label);
        driver.actions().mouseMove(util.findelement(type, element)).perform().then(function(){
                    log.logtoconsole('PASS: Moved to '+label)
                },
                function(err){
                    log.errorroutine(err)
                });;

    },

    mousemoveandclick: function (type, element, label) {

            module.exports.validateelementpresent(type, element, label);
        driver.actions().mouseMove(util.findelement(type, element)).click().perform().then(function(){
                    log.logtoconsole('PASS: Moved to and Clicked '+label)
                },
                function(err){
                    log.errorroutine(err)
                });
    },

    //Use this function to move mouse to element (hover) and click element with any selector
    hoverelementandclick: function (hovertype, hoverelement, hoverlabel, clicktype, clickelement, clicklabel) {
            module.exports.mousemovetoelement(hovertype, hoverelement, hoverlabel)
        driver.sleep(10000)
            module.exports.mousemoveandclick(clicktype, clickelement, clicklabel)
    },

    //Use this function to select a checkbox if it is unselected...with any selector
    selectcheckboxifunselected: function (type, element, label) {
        module.exports.validateelementpresent(type, element, label);
        util.findelement(type, element).isSelected().then(function (ischecked) {
            if (ischecked) {
                log.logtoconsole(label + ' Checkbox is already selected');
            } else {
                module.exports.clickElement(type, element, label);
            }

        });

    },

    //Use this function to unselect a checkbox if it is already selected...with any selector
    unselectcheckboxifselected: function (type, element, label) {
        module.exports.validateelementpresent(type, element, label);
        util.findelement(type, element).isSelected().then(function (ischecked) {
            if (ischecked) {
                log.logtoconsole(' unchecking the checkbox ');
                module.exports.clickElement(type, element, label);
            } else {
                log.logtoconsole(label + ' Checkbox is already unchecked');
            }
        });
    },

    toogleaccordionandclick: function (elementtype, parentloc, childloc, parentlabel, childlabel, pageheaderxpath, pageheadertext) {
        async.series([function (callbackpro) {
            log.logtoconsole("Clicking " + parentlabel);
            module.exports.clickElement(elementtype, parentloc,parentlabel);
            log.logtoconsole("Clicking " + childlabel);
            module.exports.clickElement(elementtype, childloc, childlabel);
            module.exports.validateelementtext(pageheaderxpath, pageheadertext);
            callbackpro(null);
        }], function (err, result) {
            if(err) {
               log.errorroutine(err);
            }
        });
    },

    switchtomainwindow: function () {
        var mainwinHandle;
        driver.wait(function () {
            log.logtoconsole("Getting all Window handles");
            return driver.getAllWindowHandles().then(function (Window) {
                log.logtoconsole("All Window Handles: " + Window);
                log.logtoconsole("Main Window Handle: " + Window[0]);
                log.logtoconsole("prod Window Handle: " + Window[1]);
                return mainwinHandle = Window[0];

            });
        }, 6000).then(function () {
        }, function (err) {
           log.errorroutine(err);
        })
        driver.wait(function () {
            log.logtoconsole("Main Window Handle:" + mainwinHandle);
            log.logtoconsole("trying to switch to Main window");
            return driver.switchTo().window(mainwinHandle).then(function (Switch) {
                return driver.getWindowHandle().then(function (currhandle) {
                    log.logtoconsole("Current Window Handle: " + currhandle);
                    if (currhandle === mainwinHandle) {
                        log.logtoconsole('switched to main window');
                        return true;
                    }
                });
            });
        }, 6000).then(function () {
        }, function (err) {
           log.errorroutine(err);
        });

    },

    switchtowindow: function (state) {
        async.series([function (next){
            getWindowHandles(next)
            }], function (err, result) {
    
                if(err) {
                    log.logtoconsole(err);
                }

                log.logtoconsole('result = '+result)
            switchto(state,result)
        });
    },

    scrolldown: function (hor, ver) {
        var script = '"window.scrollBy(' + hor + ',' + ver + ')", ""';
        driver.executeScript(script);
    },

    scrollto: function (hor, ver) {
        var script = "window.scrollTo('" + hor + "','" + ver + "')";
        driver.executeScript(script);
    },

    scrollToTop: function () {
        var script = "window.scrollTo(0,-Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,document.documentElement.clientHeight))";
        driver.executeScript(script);
    },

    scrollToEnd: function () {
        var script = "window.scrollTo(0,document.body.scrollHeight)";
        driver.executeScript(script);
    },

    pauseTest: function(time){
        log.logtoconsole('Paused execution for '+ time/1000 + ' secs...') 
        driver.sleep(time)
    },

    guidGenerator: function() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
    
        return (S4()+S4()+S4()+S4()+S4());
    },














    //VALIDATIONS
    validatePageTitle: function (Title) {
        log.logtoconsole("Validating page title...");
        driver.wait(
            driver.getTitle().then(function (title) {
            log.logtoconsole("Actual Title: "+ title)
                log.logtoconsole("Expected Title: "+ Title)
            if (title === Title) {
                log.logtoconsole('Page is displayed successfully!');
                return true;
            } else {
                log.assertEqualto(title, Title, 'Page:')
            }

        }),50000,'should be')
    },

    //Use this function to validate if any type of element is present
    validateelementpresent: function (type, element, label) {
        //driver.manage().timeouts().implicitlyWait(120000);
       util.findelement(type, element).then(function (present) {
            if (present) {
                log.logtoconsole(label + " is present");
                return true;
            } else {
                log.assertTrue(label,'present',present)
            }
        });

    },

    //use to validate if an element is now located on the DOM
    validateelementlocated: function (type, element, label) {
        //driver.manage().timeouts().implicitlyWait(120000);
        util.elementlocated(type, element).then(function (located) {
            if (located) {
                log.logtoconsole(label + " has been located");
                return true;
            } else {
                log.assertTrue(label,'located', located)
            }
        });
    },

    //Use this function to validate if any type of element is displayed
    validateelementdisplayed: function (type, element, label) {
        //driver.manage().timeouts().implicitlyWait(120000);
        module.exports.validateelementpresent(type, element, label);
        util.findelement(type, element).isDisplayed().then(function (Link) {
            log.logtoconsole('Link = ' + Link);
            if (Link) {
                log.logtoconsole("Validation == PASS :: " + label + " is displayed");
                return true;
            } else {
                log.assertTrue(label,'displayed',Link)
            }
        }, function (err) {
            log.errorroutine(err);
        });
    },

    //Use this function to validate if any type of element is selected
    validateelementselected: function (type, element, label) {
        //driver.manage().timeouts().implicitlyWait(120000);
        module.exports.validateelementdisplayed(type, element, label);
        util.findelement(type, element).isSelected().then(function (link) {
            if (link) {
                log.logtoconsole("Validation == PASS :: " + label + " is Selected");
                return true;
            } else {
                log.assertTrue(label,'selected',link)
            }
            assert(util.findelement(type, element)).isSelected.isTrue();
        }, function (err) {
            log.errorroutine(err);
        });

    },

    //Use this function to validate the text of any type of element
    validateelementtext: function (type, element, text, label) {
        module.exports.validateelementpresent(type, element, label);
        //driver.manage().timeouts().implicitlyWait(120000);
        
        util.findelement(type, element).getText().then(function (Text) {
            log.logtoconsole('Actual Text: ' + Text);
            log.logtoconsole('Expected Text: ' + text);

            var link = (Text === text);

            if (link) {
                log.logtoconsole(label + " text is equal to " + "\"" + Text + "\"");
                return true;
            } else {
                log.assertEqualto(Text, text, label)
            }
        });
    },

    validatepartialelementtext: function (type, element, text,label) {
        module.exports.validateelementpresent(type, element, label);
        //driver.manage().timeouts().implicitlyWait(120000);
        
        util.findelement(type, element).getText().then(function (Text) {
            log.logtoconsole('Actual Text: ' + Text);
            log.logtoconsole('Expected Text: ' + text);

            //var link = (Text === text);
            var contains = Text.includes(text);

            if (contains) {
                log.logtoconsole(label + " text contains " + "\"" + text + "\"");

                return true;
            } else {
                log.assertEqualto(Text,text,label)
            }
        });
    },

    //Use this function to validate if any type of element contains a given text
    validateelementcontainstext: function (type, element, text, label) {
        async.series([function (callbackpro) {
            module.exports.validateelementdisplayed(type, element, label);
            //driver.manage().timeouts().implicitlyWait(120000);
            util.findelement(type, element).getText().then(function (Text) {
               log.logtoconsole('Current text is :' + Text);
                log.logtoconsole('Expected text is :' + text);
                var link = Text.indexOf(text) > -1;
                if (link) {
                    log.logtoconsole("Validation == PASS :: " + text + " is found in " + Text);
                    return true;
                } else {
                    log.assertContains(Text,text,label)
                }
            })
            callbackpro(null);
        }], function (err, result) {
            if(err) {
               log.errorroutine(err);
            }
        });

    },

    validateurl: function (url) {
        //driver.manage().timeouts().implicitlyWait(120000);
        driver.getCurrentUrl().then(function (link) {
            log.logtoconsole('Actual URL is : ' + link);
           log.logtoconsole('Expected URL is: ' + url);
            var check = (link === url);
           log.logtoconsole('link is equalto url :' + check);
            if (check) {
                log.logtoconsole("Correct URL Displayed");
                log.logtoconsole('URL :' + link + ' is displayed');
               log.logtoconsole('URL :' + url + ' should be displayed');
                return true;
            } else {
                log.assertEqualto(url,link,'Url');
            }
        });
    },

    validatepagenot404: function (page) {
        driver.getTitle().then(function (name) {
            var result = (name.indexOf("404") !== 0)
            if (result) {
                log.logtoconsole("Page: " + page + " displayed successfully");
                return true;
            } else {
                log.assertContains(name,'404',page);
            }
        });
    },

    //Use this function to validate button is selected with any element
    valradioBtnisselected: function (type, element, label) {
        async.series([function (callbackpro) {
            module.exports.validateelementpresent(type,element, label);
            //driver.manage().timeouts().implicitlyWait(120000);
            util.findelement(type, element).getAttribute('checked').then(function (attribute) {
                if (attribute = 'checked') {
                    log.logtoconsole("Validation == PASS :: " + label + ' is selected')
                } else {
                    log.assertEqualto(attribute,checked,label)
                }
            })
            callbackpro(null);
        }], function (err, result) {
            if(err) {
                log.errorroutine(err);
            }
        });

    },
    
    validatcurrwindowHandle: function (winHandle) {
        driver.wait(function () {
            log.logtoconsole("Getting current Window handle");
            driver.getWindowHandle().then(function (Window) {
                log.logtoconsole("Current Window Handle: " + Window);
                if (winHandle === Window) {
                    log.logtoconsole("On current Window");
                    return true;
                } else {
                    log.logtoconsole("not on current window");
                    return false;
                }

            });
        }, 6000).then(function () {
        }, function (err) {
            log.errorroutine(err);
        });
    }
}