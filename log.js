/**
 * Created by Raphael Edwards.
 */

var until = require('selenium-webdriver').until;
//var csv = require('./filestreamer');

var fs = require('fs');
var path = require('path');
//var execFile = process.argv[3];
var dir;
//var suite_id
var filename;
var logfile;
var imgfile;
var txtArray;
var assert = require('selenium-webdriver/testing/assert');
var async = require('async');
var asserts = require('chai').assert;
var db = null;
//var a =require('./reportcalls')
//var config = require('./dataconfig');

module.exports = {

    browser: null,

    addDriver:function(driver){
        module.exports.browser = driver;
    },

    assertContains: function (string, Substring, label) {
        async.series([function (next) {
            takescreenshot(next)
        }

        ], function (err, response) {
            console.log("response =" + response)
            actualmsg(label + string + " does not contain " +  Substring);
            expectedmsg(label + string + " contains " + Substring);
            assert(string).contains(Substring);
        })
    },

    assertTrue: function (label, condition, boolean) {
        async.series([function (next) {
            takescreenshot(next)
        }

        ], function (err, response) {
            logtoconsole(label + " is not " + condition)
            actualmsg(label + " not " + condition);
            expectedmsg(label + " should be " + condition);
            //assert(boolean).isTrue();
            asserts.isTrue(boolean, label + " is not " + condition)
        })
    },

    assertEqualto: function (actual, expect, label) {
        var actms = label + " is " + actual
        var exptms = label + " should be " + expect
        async.series([function (next) {
            takescreenshot(next)
        }

        ], function (err, response) {
            //logtoconsole(assert(actual).equalTo(expect))
            logtoconsole(actms + exptms)
            actualmsg(actms);
            expectedmsg(exptms);
            //assert(actual).equalTo(expect);
            asserts.equal(actual, expect, actual + " is not equal to " + expect);
        })
    },

    assertNotEqualto: function (actual, expect, label) {
        var actms = label + " is " + actual
        var exptms = label + " should be " + expect
        async.series([function (next) {
            takescreenshot(next)
        }

        ], function (err, response) {
            console.log("response =" + response)
            console.log("ERR= " + actms + exptms)
            actualmsg(actms);
            expectedmsg(exptms);
            assert(actual === expect).isFalse();
        })
    },

    logtoconsole: function (msg) {
        module.exports.browser.wait(function () {
            console.log(msg);
            return true;
        }, 50000);
    },

    errorroutine: function (err) {

        async.series([function (next) {
                takescreenshot(next)
            }],
            function (error, response) {
                logtoconsole("Error Occured: " + err);
                console.log("response =" + response)
                logtoFile("Error Occured: " + err.state);
                assert(err).isTrue();
            })
    },

    gettestname : function (test_name, suite_name) {
        //logtoconsole("getting test name");
        //logtoconsole('Testname: ' + test_name);
        //logtoconsole('Suite name: ' + suite_name);
        filename = test_name;
        repdir = './Reports'
        proddir = repdir + path.sep + suite_name
        suitedir = proddir + path.sep + test_name + '_logs'
        imgdir = suitedir + path.sep + 'screenshots';

        /*proddir='./Reports'+ path.sep+test_name
        suitedir=proddir+ path.sep +suite_name+ 'logs'
        imgdir = suitedir+path.sep+ 'screenshots';*/
    
        async.series([
            function (cb) {
            createdirSync(repdir);
            cb();
            },
            function (cb) {
                createdirSync(proddir);
                cb();
            },
            function (cb) {
                createdirSync(suitedir);
                cb();
            },
            function (cb) {
                createdirSync(imgdir);
                cb();
            }])

        
        logfile = suitedir + path.sep + filename + ".txt";
        imgfile = imgdir + path.sep + filename + ".png";
        /*deletefileSync(imgfile);
        deletefileSync(logfile);*/
    },

    checkproductName:function(productinfo){
       gettestname(productinfo)
    }
}

var takescreenshot= function (cb) {
    module.exports.browser.takeScreenshot().then(function (data) {
            console.log('saving screenshot to ' + imgfile);
            var base64Data = data.replace(/^data:image\/png;base64,/, "");
            //console.log('base 64 data is ' + base64Data);
            cb(null,writeimagetofile(imgfile,base64Data))
//ATTENTION: ADD API CALL TO LOG TO DB
        },function(err){
            console.log(err)
        }
    );
}

var writeimagetofile=function(filename,imageData) {
    fs.writeFile(filename, imageData, 'base64', function (err) {
        console.log("writing imagetofile")
        if (err) {
            throw err;
        }
    })
}

var logtoconsole= function (msg) {
    module.exports.browser.wait(function () {
        console.log(msg);

        return true
    }, 50000);
};

var failroutine= function (condition, failmsg) {
    logtoconsole(failmsg);
    takescreenshot();
    logtoFile(failmsg);
    assert(condition).isTrue();

    return false;
}

var errorroutine = function (err){
    logtoconsole("Error Occured: " + err.state);
    takescreenshot();
    logtoFile("Error Occured: " + err.state);
    assert(err).isTrue();
}

var logtoFile = function (message) {

    module.exports.logtoconsole("logging to file: " + logfile);
    //fs.createWriteStream(logfile);
    fs.appendFile(logfile, message + "\n", function (err) {
        if (err) {
            throw err;
        }
    });
            /*var update_arr = {
                "file_log": message
            }
            //ATTENTION:::Make API call here!
            db.updateBuild_Results(module.exports.build_result_id, update_arr);
            browser.wait(function () {
                if (db.affectedRows != null) {
                    module.exports.logtoconsole(db.affectedRows + ' row(s) affected');
                    return true;
                } else {
                    return false;
                }
            }, 500);*/
       //
};

var logtodataFile = function (message) {
    module.exports.logtoconsole("logging to file: " + logfile);
    // fs.createWriteStream(logfile);
    fs.appendFile(logfile, message + "\n", function (err) {
        if (err) {
            throw err;
        }
        /*
         * var update_arr = { "file_log":message }
         * db.updateBuild_Results(module.exports.build_result_id,update_arr);
         * browser.wait(function(){ if(db.affectedRows!=null){
         * module.exports.logtoconsoletoFileonlylog(db.affectedRows+' row(s) affected');
         * return true; }else{ return false; } },500);
         */
    });
};

    var actualmsg = function (message) {
        logtoconsole("logging actual msg to file: " + logfile);
        //fs.createWriteStream(logfile);
        fs.appendFile(logfile, "Actual Result= " + message + "\n", function (err) {
            if (err) {
                throw err;
            }
            /*var update_arr = {
                "actual_message": message
            }
            //ATTENTION:::Make API call here!
            db.updateBuild_Results(module.exports.build_result_id, update_arr);
            browser.wait(function () {
                if (db.affectedRows != null) {
                    module.exports.logtoconsole(db.affectedRows + ' row(s) affected');
                    return true;
                } else {
                    return false;
                }
            }, 500);*/
        });

    };

    var expectedmsg = function (message) {
        logtoconsole("logging expected msg to file: " + logfile)
        //fs.createWriteStream(logfile);
        fs.appendFile(logfile, "Expected Result= " + message + "\n\r", function (err) {
            if (err) {
                throw err;
            }
            /*var update_arr = {
                "expected_message": message
            }
            //ATTENTION:::Make API call here!
            db.updateBuild_Results(module.exports.build_result_id, update_arr);
            browser.wait(function () {
                if (db.affectedRows != null) {
                    module.exports.logtoconsole(db.affectedRows + ' row(s) affected');
                    return true;
                } else {
                    return false;
                }
            }, 500);*/
        });
    };

    var gettestname = function (test_name, suite_name) {
        logtoconsole("getting test name");
        logtoconsole('Testname: ' + test_name);
        logtoconsole('Suite name: ' + suite_name);
        filename = productinfo.test_name;
        repdir ='./Reports'
        proddir='./Reports'+ path.sep+test_name
        suitedir=proddir+ path.sep +suite_name+ '_logs'
        imgdir = suitedir+path.sep+ 'screenshots';
        //getexecfile();
        //console.log("repdir = ",repdir)
        async.series([function(cb){
            createdirSync(repdir);
            cb();
        },
        function (cb) {
            createdirSync(proddir);
            cb();
        },
        function (cb) {
            createdirSync(suitedir);
            cb();
        },
        function (cb) {
            createdirSync(imgdir);
            cb();
        }])







        //module.exports.clearDirSync(dir);
        logfile = suitedir + path.sep + filename + ".txt";
        imgfile = imgdir + path.sep + filename + ".png";
        deletefileSync(imgfile);
        deletefileSync(logfile);

        //module.exports.checkTestNamePresentInDB(testname, suitename);
    };

    var deletefileSync = function (filename) {
        fs.exists(filename, function (exists) {
            if (exists) {
                fs.unlinkSync(filename);
                logtoconsole("file deleted" + filename);
            }
        });
    };

    var getexecfile = function () {
        if (path.basename(execFile)) {
            execFile = path.basename(execFile);
        }
       logtoconsole("FolderName: " + execFile);
    };

    var createdirSync = function (dirname) {
        fs.exists(dirname, function (exist) {
            if (!exist) {

                fs.mkdirSync(dirname);
                logtoconsole(dirname + " Directory created");
            }
            else {
                //logtoconsole(dirname + " exists");
            }
            //Todo: return dirname and initialise it to a variable???
        });

    };

    var clearDirSync = function (dirPath) {
        try {
            var files = fs.readdirSync(dirPath);
        }
        catch (e) {
            return;
        }
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var filePath = dirPath + '/' + files[i];
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
        }


    };

    var checkTestNamePresentInDB = function (testName, suitename) {
        //ATTENTION:::Make API call here for entire function!
        db.addDriver(browser);
        var test_id = null;
        var suite_id = null;
        db.getSuiteIdFromSuites(suitename, config.confData.testProduct);
        module.exports.browser.wait(function () {
            if (db.suiteid_data != null) {
                module.exports.logtoconsole("Checking Suite ID ::");
                var suites = db.suiteid_data
                if (typeof (suites) == 'object'
                    && Object.keys(suites).length > 0) {
                    suite_id = db.suiteid_data[0]['suite_id'];
                    module.exports.logtoconsole("SUITE ID EXITS ")
                    module.exports.logtoconsole("Suites ID is :: " + suite_id);
                } else {
                    module.exports.logtoconsole("New Suite was Inserted into Suite table");
                    var array = {
                        'suite_name': suitename,
                        'product': config.confData.testProduct}
                    db.insertNewSuiteInToSuites(array);
                    module.exports.browser.wait(function () {
                        if (db.insertId != null) {
                            suite_id = db.insertId;
                            module.exports.logtoconsole("NEWLY INSERTED SUITE_ID ", suite_id);
                            return true;
                        } else {
                            return false;
                        }
                    }, 5000);
                }
                module.exports.browser.wait(function () {
                    if (suite_id != null) {
                        module.exports.suite_id = suite_id;
                        return true;
                    } else {
                        return false;
                    }
                }, 4000);
                return true;
            } else {
                return false;
            }
        }, 10000);
        module.exports.browser.wait(function () {
            if (module.exports.suite_id != null) {
                db.getTestBuildsFromName(testName, config.confData.testProduct, module.exports.suite_id);
                return true;
            } else {
                return false;
            }
        }, 6000);
        module.exports.browser.wait(function () {
            if (db.data != null) {
                var test_builds = db.data;
                module.exports.logtoconsole('test_builds', test_builds[0]);
                if (typeof (test_builds) == 'object' && Object.keys(test_builds).length > 0) {
                    test_id = test_builds[0]['test_id'];
                    module.exports.logtoconsole("TEST ID ::: ", test_id);
                    module.exports.logtoconsole('Updating a record in Test_Build table');
                    var update_arr = {'last_executed_date': module.exports.start_time}
                    db.updateTest_Build(testName, config.confData.testProduct, update_arr, module.exports.suite_id);
                } else {
                    module.exports.logtoconsole('Inserting a record in to Test_Build table');
                    db.insertTest_Build(testName, config.confData.testProduct, module.exports.start_time, module.exports.suite_id);
                    module.exports.browser.wait(function () {
                        if (db.insertId != null) {
                            test_id = db.insertId;
                            module.exports.logtoconsole("NEWLY INSERTED TEST_ID ", test_id);
                            return true;
                        } else {
                            return false;
                        }
                    }, 5000);
                }
                module.exports.browser.wait(function () {
                    if (test_id != null) {
                        module.exports.build_id = test_id;
                        return true;
                    } else {
                        return false;
                    }
                }, 5000);
                module.exports.browser.wait(function () {
                    if (module.exports.build_id != null) {
                        db.insertTest_Build_Results(module.exports.build_id, module.exports.browsername, module.exports.start_time);
                        module.exports.browser.wait(function () {
                            if (db.insertId != null) {
                                module.exports.build_result_id = db.insertId;
                                var updateArr = {'status': 'failed'};
                                db.updateStatus_Build_Results(updateArr);
                                return true;
                            } else {
                                return false;
                            }
                        }, 5000);
                        return true;
                    } else {
                        return false;
                    }
                }, 5000);
                return true;
            } else {
                return false;
            }
            }, 5000);
    };

    var updateResultsInTest_Build_Results= function (status, errMsg) {
        module.exports.logtoconsole("errMsg= ", errMsg)
        if (errMsg == 'undefined' || errMsg == null) {
            errMsg = '-';
        }
        var date1 = new Date(module.exports.start_time);
        var date2 = new Date(module.exports.getMysqlDate());
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        //ATTENTION:::Make API call here!
        var updateArr = {
            'test_end_date': db.getMysqlDate(),
            'status': status,
            'time_taken': timeDiff,
            'file_log': errMsg
        }
        try {
            module.exports.logtoconsole("Updating the Results in DB");
            module.exports.logtoconsole("updateArr = ", updateArr);
            db.updateBuild_Results(module.exports.build_result_id, updateArr);
        } catch (e) {
            module.exports.logtoconsole("Failed to update a record in DB Results Table", e);
        }
    } ;

    var updateResultsInTest_Build= function (testName) {
        var updateArr = {};
        //ATTENTION:::Make API call here for entire function!
        db.getPassAndFailCount('passed', module.exports.build_id);
        module.exports.browser.wait(function () {
            module.exports.logtoconsole("in here");
            if (db.passcount != null) {
                module.exports.passcount = db.passcount;
                return true;
            } else {
                return false;
            }
        }, 5000);
        db.getPassAndFailCount('failed', module.exports.build_id);
        module.exports.browser.wait(function () {
            if (db.failcount != null) {
                module.exports.failcount = db.failcount;
                return true;
            } else {
                return false;
            }
        }, 5000);
        var lastStatus = null;
        db.getLastExecutedStatus(module.exports.build_result_id);
        module.exports.browser.wait(function () {
            if (db.last_status != null) {
                lastStatus = db.last_status;
                return true;
            } else {
                module.exports.logtoconsole();
                return false;
            }
        }, 5000);
        module.exports.browser.wait(function () {
            if (module.exports.failcount != null && module.exports.passcount != null) {
                module.exports.logtoconsole("here finally")
                updateArr = {
                    'total_pass': module.exports.passcount,
                    'total_failures': module.exports.failcount,
                    'last_executed_status': lastStatus}
                db.updateTest_Build(testName, config.confData.testProduct, updateArr, module.exports.suite_id);
                return true;
            } else {
                module.exports.logtoconsole("In fail and pass count ");
                return false;
            }

        }, 5000)
    };

     var updateFinalResults = function (results, title, txtdata) {
        module.exports.logtoconsole("module.exports.total404menus= ", module.exports.total404menus)
        var err = null;
        var state = 'passed'
        var filelog = null

        if (module.exports.total404Pages > 0) {
            state = "failed";
        }
        if (results['state'] == 'failed') {
            state = 'failed'
        }
        if (typeof (txtdata) != 'undefined') {
            filelog = txtdata.toString();
        }
        else {
            filelog = '-'
        }
        /*
         * if(parseInt(config.confData.address.lga_csv.total_failed) > 0 ){
         * state = "failed"; }
         */
        if (module.exports.urltest_categories['failedcategory'] != 0 || module.exports.linkNotFound != 0
            || module.exports.urltest_categories['failedsubcategory'] != 0
            || module.exports.urltest_categories['failedsubsubcategory'] || module.exports.total404menus != 0) {
            state = "failed";
        }
        module.exports.logtoconsole("state= ", state)
        module.exports.logtoconsole("filelog= ", filelog)
        module.exports.updateResultsInTest_Build_Results(state, filelog);
        module.exports.updateResultsInTest_Build(title);
    }