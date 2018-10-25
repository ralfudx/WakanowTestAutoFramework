/**
 * Created by Raphael Edwards.
 */

var async = require('async');
var action = require('./../action');
var log = require('./../log');

module.exports = {

    //GMail login
    gmailLogin: function (type, gmaillogin, userinfo) {
        async.series([
            function (cb) {
                action.enterText(type['id'], gmaillogin['usernameID'], '\"Email or phone\" textfield', userinfo['gmailusername']);
                cb();
            },
            function (cb) {
                action.clickElement(type['id'], gmaillogin['usernextbutID'], '\"NEXT\" button');
                cb();
            }/*,
            function (cb) {
                action.enterText(type['id'], gmaillogin['passwordID'], '\"Password\" textfield', userinfo['gmailpassword']);
                cb();
            },
            function (cb) {
                action.clickElement(type['xpath'], gmaillogin['passwordnextbutXpath'], '\"NEXT\" button');
                cb();
            }*/],
            function (err, result) {
                if (err) {
                    log.errorroutine(err);
                }
            }
        );
    },

    //CBS login
    cbsLogin: function (type, cbslogin, logininfo, correctlogin, cbsportal, portalinfo) {
        async.series([
            function (cb) {
                action.validatepartialelementtext(type['xpath'], cbslogin['headertextXpath'], logininfo['loginheadertext'], 'Login Header');
                cb();
            },
            function (cb) {
                action.enterText(type['id'], cbslogin['usernameID'], '\"Username\" textfield', logininfo['cbsusername']);
                if (correctlogin) {
                    action.enterText(type['xpath'], cbslogin['passwordXpath'], '\"Password\" textfield', logininfo['cbspassword']);
                } else {
                    action.enterText(type['xpath'], cbslogin['passwordXpath'], '\"Password\" textfield', logininfo['cbsincorrectpassword']);
                }
                cb();
            },
            function (cb) {
                action.clickElement(type['xpath'], cbslogin['signinbutXpath'], '\"Sign In\" button');
                cb();
            },
            function (cb) {
                if (correctlogin) {
                    action.validatePageTitle(cbsportal['title'])
                    action.validatepartialelementtext(type['xpath'], cbsportal['portalheaderXpath'], portalinfo['portalheadertext'], 'Portal Header');
                } else {
                    action.validatepartialelementtext(type['xpath'], cbslogin['incorrectsigninXpath'], logininfo['incorrectlogintext'], 'Incorrect Login');
                }
                cb();
            }],
            function (err, result) {
                if (err) {
                    log.errorroutine(err);
                }
            }
        );
    },

    //CBS logout ::: Precondition - A valid login session must be pre-established
    cbsLogout: function (type, cbslogin, logininfo, cbsportal) {
        async.series([
            function (cb) {
                action.scrollToEnd();
                cb();
            },
            function (cb) {
                action.clickElement(type['xpath'], cbsportal['logoutmenuXpath'], '\"Logout\" Menu');
                cb();
            },
            function (cb) {
                action.validatePageTitle(logininfo['title'])
                action.validatepartialelementtext(type['xpath'], cbslogin['loggedoutmsgXpath'], logininfo['loggedouttext'], 'Logged out');
                cb();
            }],
            function (err, result) {
                if (err) {
                    log.errorroutine(err); clickallmenuitems
                }
            }
        );
    },

     //CBS Click all Menu items
    cbsClickItems: function (type, portalinfo, cbsportal) {
        async.series([
            function (cb) {
                action.clickallmenuitems(type['xpath'], portalinfo['numberofmenuitems'], cbsportal['allmenuparentXpath'], cbsportal['allmenuchildXpath'], cbsportal['title']);
                cb();
            }],
            function (err, result) {
                if (err) {
                    log.errorroutine(err); 
                }
            }
        );
    },

    //CBS Set up new user
    cbsUserSetUp: function (type, cbsportal, portalinfo) {
        async.series([
            function (cb) {
                action.clickElement(type['xpath'], cbsportal['usersetupmenuXpath'], '\"User Set Up\" Menu');
                cb();
            },
            function (cb) {
                action.clickElement(type['xpath'], cbsportal['createnewuserXpath'], '\"Create New User\" Menu Option');
                cb();
            },
            function (cb) {
                action.enterText(type['name'], cbsportal['firstnameboxName'], '\"First Name\" textfield', portalinfo['firstname']);
                action.enterText(type['name'], cbsportal['lastnameboxName'], '\"Last Name\" textfield', portalinfo['lastname']);
                action.enterText(type['name'], cbsportal['usernameboxName'], '\"Username\" textfield', portalinfo['firstname'] + '_' + action.getCurrentDateTimeString());
                action.enterText(type['name'], cbsportal['emailboxName'], '\"Email\" textfield', action.generateRandomEmail(portalinfo['firstname'], portalinfo['lastname']));
                action.enterText(type['name'], cbsportal['phoneboxName'], '\"Phone Number\" textfield', action.getCurrentDateTimeString());
                action.enterText(type['name'], cbsportal['empnumberboxName'], '\"Employee Number\" textfield', portalinfo['employeenumber']);
                cb();
            },
            function (cb) {
                action.clickElement(type['xpath'], cbsportal['orgdropdownXpath'], '\"Organization\" dropdown option');
                action.clickElement(type['xpath'], cbsportal['respdropdownXpath'], '\"Responsibility\" dropdown option');
                cb();
            },
            function (cb) {
                action.clickElement(type['xpath'], cbsportal['savebuttonXpath'], '\"Save\" button');
                cb();
            },
            function (cb) {
                action.acceptAlert();
                action.validatepartialelementtext(type['xpath'], cbsportal['usercreatedmsgXpath'], portalinfo['usercreatedmsg'], 'Success Message');
                cb();
            }],
            function (err, result) {
                if (err) {
                    log.errorroutine(err);
                }
            }
        );
    }
    
    
}