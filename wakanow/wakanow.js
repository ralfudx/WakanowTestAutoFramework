//validate elements are present first always
var webdriver = require('selenium-webdriver');
var until = require('selenium-webdriver').until;
var csv = require('./filestreamer');
var proc = process.title;
var fs = require('fs');
var path = require('path');
var execFile = process.argv[3];
var dir;
var filename;
var logf ile;
var imgfile;
var txtArray;
var assert = require('selenium-webdriver/testing/assert');
var driver;
var async = require('async');

var db = null;
var config = require('./dataconfig');
module.exports = {
    confMod: [],
    total404Pages: 0,
    total200Pages: 0,
    filter_count: 0,
    newData: [],
    confData: [],
    textArray: [],
    dropDownArray: [],
    attArray: [],
    prodpricesArray: [],
    prodnameArray: [],
    build_id: null,
    build_result_id: null,
    browsername: null,
    start_time: null,
    passcount: null,
    failcount: null,
    dir: null,
    logArray: [],
    homeurl: null,
    hometitle: null,
    totalrecords: 0,
    totalmenus: 0,
    totalimages: 0,
    totalprice: null,
    amountdue: null,
    responseMessage: null,
    heavyitemchargeandquanity: [],
    linkNotFound: 0,
    totallink404Pages: 0,
    total404images: 0,
    total200images: 0,
    total404menus: 0,
    total200menus: 0,
    urltest_categories: {
        passedcategory: 0,
        passedsubcategory: 0,
        passedsubsubcategory: 0,
        failedcategory: 0,
        failedsubcategory: 0,
        failedsubsubcategory: 0,
        totalMainCategories: 0,
        totalsubCategories: 0,
        totalsubsubCategories: 0
    },

    //SET-UP FUNCTIONS
    openbrowser: function (browser) {
	        module.exports.setStartTime(module.exports.getMysqlDate());
	        if (db == null) {
	            db = require('./connection.js');
	        }
	        if (typeof (browser) === 'undefined') {// initialize if driver variable
	            browser = config.confData.default_browser;
	        }// is undefined
	        module.exports.browsername = browser;
	        driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities({
				'browserName': browser
			}).build();
	        driver.manage().deleteAllCookies();
	        driver.manage().window().maximize();
	        //driver.manage().timeouts().implicitlyWait(20000);

    },
    openurl: function (url, title) {
		// console.log("proc= "+process.cwd());
		driver.manage().timeouts().pageLoadTimeout(120000);
		driver.get(url).then(function () {
		}, function (err) {
			console.log("Error Title: " + err.state);
			module.exports.takescreenshot();
			// module.exports.logtoFile(err.state);
			module.exports.logtoFile("Page: " + title + " failed to load after 2 mins")
		});
		driver.manage().timeouts().implicitlyWait(20000);
		module.exports.validatepagetitle(title);

    },

    closebrowser2: function (results, title) {
		console.log("logfile= ", logfile)
		async.series([
			function (next) {
				module.exports.readLogFile(logfile, next)
			}
		], function (err, response) {
			module.exports.updateFinalResults(results, title, response);
			assert(module.exports.total404Pages == 0).isTrue();
			assert(module.exports.totallink404Pages == 0).isTrue();
			assert(module.exports.linkNotFound == 0).isTrue();
			assert(module.exports.total404menus == 0).isTrue();
		})
		module.exports.logtoconsole("ready to close browser");
		driver.quit();
    },
    closebrowser: function() {
		module.exports.logtoconsole("Ready to close browser");
		driver.quit();
    },

	openmultiplebrowser: function (browser) {
		driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').withCapabilities({
			'browserName': browser
		}).build();
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(50000);
    },

    //HELPER FUNCTIONS
    hitlogin: function (title, accounttype, accountid, accountlabel, logintype, loginxpath, loginlabel) {
		driver.sleep(2000);
		module.exports.logtoconsole("logging in");
		module.exports.clickelement(accounttype, accountid, accountlabel);
		module.exports.clickelement(logintype, loginxpath, loginlabel);
		driver.sleep(10000);
		module.exports.validatepagetitle(title);
	},
    wakalogin: function (title, usernameid, username, passwordid, password, loginbtn) {
		module.exports.hitlogin(title, accountid, loginxpath);
		module.exports.validatepagetitle(title);
		module.exports.sendkeysid(usernameid, 'Username Box', username);
		module.exports.sendkeysid(passwordid, 'Password Box', password);
		module.exports.clickxpath(loginbtn, 'Login Button');
    },
    validatelogin: function (){
	},
    getRandomNumber: function (number) {
		var result = Math.floor((Math.random() * number) + 1);
		return result;
	},

	logtoconsole: function (msg) {
		driver.wait(function () {
			console.log(msg);
			return true;
		}, 50000);
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

   elementpresent:function (type, element){
		switch(type) {
			case "css":
				return driver.isElementPresent(webdriver.By.css(element));
			case "id":
				return driver.isElementPresent(webdriver.By.id(element));
			case "xpath":
				return driver.isElementPresent(webdriver.By.xpath(element));
			case "linkText":
				return driver.isElementPresent(webdriver.By.linkText(element));
			case "name":
				return driver.isElementPresent(webdriver.By.name(element));
			case "class":
				return driver.isElementPresent(webdriver.By.className(element));
			default:
				return driver.isElementPresent(webdriver.By.id(element));
		}
	},

	findelement: function (type, element){
		switch(type) {
			case "css":
				return driver.findElement(webdriver.By.css(element));
			case "id":
				return driver.findElement(webdriver.By.id(element));
			case "xpath":
				return driver.findElement(webdriver.By.xpath(element));
			case "linkText":
				return driver.findElement(webdriver.By.linkText(element));
			case "name":
				return driver.findElement(webdriver.By.name(element));
			case "class":
				return driver.findElement(webdriver.By.className(element));
			default:
				return driver.findElement(webdriver.By.id(element));
		}
    },
    clickelement: function (type, element, label) {
		module.exports.valelementispresent(type, element, label);
		module.exports.findelement(type, element).click();
	},

	valelementispresent: function (type, element, label) {
		module.exports.elementpresent(type, element).then(function (present) {
			if (present) {
				module.exports.logtoconsole(label + " is Present");
				return true;
			} else {
				//module.exports.takescreenshot();
				//module.exports.logtoFile(label + ' not Present');
				assert(present).isTrue();
				return false;
			}
		})
    },

	clearandsendkeys: function (type, element, label, text) {
		module.exports.valelementispresent(type, element, label);
		module.exports.findelement(type, element).clear();
		module.exports.findelement(type, element).sendKeys(text);
    },

    clickdropdowntext: function (type, element) {
		driver.sleep(5000);
		module.exports.findelement(type, element).getText().then(function(dropdowntext){
			module.exports.clickelement(type, element, dropdowntext);
			driver.actions().mouseMove(module.exports.findelement(type, element)).click().perform();
		})
	},
	switchtomainwindow: function () {
	        var mainwinHandle;
	        driver.wait(function () {
	            console.log("Getting all Window handles");
	            return driver.getAllWindowHandles().then(function (Window) {
	                console.log("All Window Handles: " + Window);
	                console.log("Main Window Handle: " + Window[0]);
	                console.log("prod Window Handle: " + Window[1]);

	                return mainwinHandle = Window[0];

	            });

	        }, 6000).then(function () {
	        }, function (err) {
	            console.log("Error Occured: " + err.state);
	            module.exports.takescreenshot();
	            // module.exports.logtoFile(err.state);
	            module.exports.logtoFile("Cannot Get previous Window, returned: ", err)
	            assert(err).isTrue();
	        })

	        driver.wait(function () {
	            console.log("Main Window Handle:" + mainwinHandle);
	            console.log("trying to switch to Main window");
	            return driver.switchTo().window(mainwinHandle).then(
	                function (Switch) {

	                    return driver.getWindowHandle().then(
	                        function (currhandle) {
	                            console.log("Current Window Handle: "
	                                + currhandle);
	                            if (currhandle === mainwinHandle) {
	                                console.log('switched to main window');
	                                return true;
	                            }

	                        });

	                });
	        }, 6000).then(function () {
	        }, function (err) {
	            console.log("Error Occured: " + err.state);
	            module.exports.takescreenshot();
	            // module.exports.logtoFile(err.state);
	            module.exports.logtoFile("Cannot switch to Previous Window returned: ", err)
	            assert(err).isTrue();
	        });

	    },
	    switchtocurrwindow: function () {
	        var prodwinHandle;
	        driver.wait(function () {
	            console.log("Getting all Window handles");
	            return driver.getAllWindowHandles().then(function (Window) {
	                console.log("All Window Handles: " + Window);
	                console.log("Main Window Handle: " + Window[0]);
	                console.log("Prod Window Handle: " + Window[1]);
	                return prodwinHandle = Window[1];
	            });

	        }, 6000).then(function () {
	        }, function (err) {
				module.exports.failroutintrue(err, "Cannot Get New Window returned: " + err.state);
	        })
	        driver.wait(function () {
	            console.log("prod Window Handle:" + prodwinHandle)
	            console.log("trying to switch to production window");
	            return driver.switchTo().window(prodwinHandle).then(function (Switch) {
					return driver.getWindowHandle().then(function (currhandle) {
						console.log("Current Window Handle: " + currhandle);
						if (currhandle === prodwinHandle) {
							console.log('successfully switched to production window');
							return true;
						}
					});
				});
	        }, 6000).then(function () {
	        }, function (err) {
				module.exports.failroutintrue(err, "Cannot Switch to New Window returned: " + err.state);
	        })

    },

    //MAIN FUNCTIONS

    searchflight: function(idtype, xpathtype, triptype, fromelem, fromcity, toelem, tocity, ticketelem,
    ticketoption, depdateboxelem, monthelem, depdayelem, retdateboxelem, retdayelem, yearelem,
    adultelem, adultoption, childelem, childoption, infantelem, infantoption, searchelem){
		module.exports.clickelement(idtype, triptype, triptype);
		module.exports.selectlocation(idtype, fromelem, "Flying From", fromcity);
		module.exports.selectlocation(idtype, toelem, "Flying To", tocity);
		module.exports.clickelement(idtype, ticketelem, "Ticket Class dropdown");
		module.exports.clickdropdowntext(xpathtype, ticketoption);
		module.exports.selectdate(idtype, depdateboxelem, xpathtype, monthelem, depdayelem, yearelem);
		module.exports.selectdate(idtype, retdateboxelem, xpathtype, monthelem, retdayelem, yearelem);
		module.exports.clickelement(idtype, adultelem, "Adults dropdown");
		module.exports.clickdropdowntext(xpathtype, adultoption);
		module.exports.clickelement(idtype, childelem, "Children dropdown");
		module.exports.clickdropdowntext(xpathtype, childoption);
		module.exports.clickelement(idtype, infantelem, "Infant dropdown");
		module.exports.clickdropdowntext(xpathtype, infantoption);
		module.exports.clickelement(idtype, searchelem, "Search Button");
	},

	valflightsearch: function(title, idtype, xpathtype, butelem, ticketclasselem, ticketclass){
		module.exports.logtoconsole("Waiting for flight search page");
		driver.sleep(10000);
		module.exports.validatepagetitle(title);
		module.exports.valelementisdisplayed(idtype, butelem, "Change Button");
		module.exports.valelementtext(xpathtype, ticketclasselem, ticketclass);
	},

	selectlocation: function(type, element, label, text){
		module.exports.clearandsendkeys(type, element, label, text);
		driver.sleep(5000);
		driver.actions().sendKeys(webdriver.Key.RETURN).perform();
	},

	selectdate: function(idtype, dateboxelem, xpathtype, monthelem, dayelem, yearelem){
		module.exports.clickelement(idtype, dateboxelem, "Date Box");
		module.exports.valelementispresent(xpathtype, monthelem, "Calender Month");
		module.exports.findelement(xpathtype, monthelem).getAttribute("value").then(function(monthcode){
			if(dateboxelem == "deptDate"){
				if(monthcode > 8){
					module.exports.logtoconsole("Switching to Next Year");
					module.exports.clickelement(xpathtype, yearelem, "Travel Year");
				}else{
					var newelem = monthelem.replace("1", "4");
					module.exports.clickelement(xpathtype, newelem, "Travel Month");
				}
			}else{
				module.exports.clickelement(xpathtype, monthelem, "Travel Month");
			}
		});
		driver.sleep(5000);
		module.exports.clickelement(xpathtype, dayelem, "Calender Day");

	},

	checkhomebanner: function(type, element, banwidth, banheight, title){
		module.exports.valbannerimage(type, element, banwidth, banheight);
		module.exports.clickelement(type, element, "Banner Image");
		driver.sleep(5000);
		module.exports.switchtocurrwindow();
		module.exports.validatepagetitle(title);
	},

	valbannerimage : function(type, element, banwidth, banheight){
		module.exports.findelement(type, element).getAttribute("width").then(function(bannerwidth){
			if(bannerwidth < banwidth){
				module.exports.failroutinetrue((bannerwidth > banwidth), "Image Width is distorted");
			}else{
				module.exports.logtoconsole("Banner Width is OK");
			}
		});
		module.exports.findelement(type, element).getAttribute("height").then(function(bannerheight){
			if(bannerheight < banheight){
				module.exports.failroutinetrue((bannerheight > banheight), "Image Height is distorted");
			}else{
				module.exports.logtoconsole("Banner Height is OK");
			}
		});
	},

    //LOGGING AND REPORTING
    failroutinetrue: function (condition, failmsg) {
		module.exports.logtoconsole(failmsg);
		//takescreenshot();
		//logtoFile(failmsg);
		assert(condition).isTrue();
		return false;
    },

    failroutineequal: function (item, actual, expected) {
    	module.exports.logmsg(item + ": " + actual + " is Displayed", item + ": " + expected + " should be Displayed");
    	//takescreenshot();
		assert(actual).equalTo(expected);
    	return false;
	},

    setConfig: function (address, payment) {
        module.exports.confData = address;
        module.exports.newData = payment;
    },

    include_req_file: function (count, filePath) {
        // var filePath =
        // '/var/www/Selenium/tests/KongaAutomationTests/SanityTests/VisitHomePage.js';
        // console.log(filePath);
        console.log('in include', count);
        if (count > 0) {
            delete require.cache[require.resolve(filePath)];
        }
        return require(require.resolve(filePath));


    },

    logmsg: function (actualmsg, expectedmsg) {
		module.exports.logtoconsole("logging actual and expected msg to file: " + logfile);
		fs.appendFile(logfile, "Actual Result = " + actualmsg + "\n", function (err) {
			if (err) {
				throw err;
			}
			var update_arr = {
				"actual_message": actualmsg
			}
		});
		fs.appendFile(logfile, "Expected Result = " + expectedmsg + "\n\r", function (err) {
			if (err) {
				throw err;
			}
			var update_arr = {
				"expected_message": expectedmsg
			}
		});
    },

    //VALIDATIONS

	validatepagetitle: function (Title) {
		module.exports.logtoconsole("validating pagetitle.......");
		driver.getTitle().then(function (title) {
			if (title === Title) {
				module.exports.logtoconsole('Page :' + Title + ' is displayed successfully');
				return true;
			} else {
				module.exports.logtoconsole('Page :' + Title + ' is not displayed successfully');
				module.exports.takescreenshot();
				module.exports.actualmsg('Page :' + title + ' :: is displayed');
				module.exports.expectedmsg('Page :' + Title + ' :: should be display');
				assert(title).equalTo(Title);
				return false;
			}
		});
		driver.manage().timeouts().implicitlyWait(10000);
    },

    valelementtext: function (type, element, label) {
		module.exports.valelementispresent(type, element, label);
	    module.exports.findelement(type, element).getText().then(function (Text) {
			console.log('Current text is :' + Text);
			console.log('Text is :' + label);
			var link = (Text === label);
			if (link) {
				console.log(label + " is displayed");
				return true;
			} else {
				module.exports.failroutineequal("Text", Text, label);
			}

		});

    },

    valelementisdisplayed: function (type, element, label) {
		module.exports.valelementispresent(type, element, label);
		module.exports.findelement(type, element).isDisplayed().then(function(Link) {
			if (Link) {
				module.exports.logtoconsole(label + " is displayed");
				return true;
			} else {
				module.exports.failroutinetrue(Link, label + " is NOT displayed");
			}
		});
    }

}