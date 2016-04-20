
var fs = require('fs');
var path = require('path');

var execFile = process.argv[3];
var dir;
var filename;
var logfile;
var imgfile;


module.exports={
		gettestname : function(testname) {
			console.log("getting test name");
			console.log('Testname: ' + testname);
			filename = testname;

			if (path.basename(execFile)) {
				execFile = path.basename(execFile, '.js');
			}
			console.log("FolderName: " + execFile);
			;
			dir = './Reports' + path.sep + execFile + 'logs';
			fs.exists(dir, function(exists) {
				if (!exists) {
					dir = fs.mkdir('./Reports/' + execFile + 'logs');
				}
			});

			logfile = dir + path.sep + filename + ".txt";
			imgfile = './Reports' + path.sep + "screenshots" + path.sep + filename
					+ ".png";

			fs.exists(logfile, function(exists) {
				if (exists) {
					console.log("deleting file" + logfile);
					fs.unlink(logfile);
				}
			});

		},
		
		takescreenshot : function() {

			console.log('saving screenshot to ' + imgfile);

			driver.takeScreenshot().then(function(data) {
				var base64Data = data.replace(/^data:image\/png;base64,/, "");
				// console.log('data is ' + base64Data);
				fs.writeFile(imgfile, base64Data, 'base64', function(err) {
					if (err) {
						throw err;
					}
				});

			});
		},

		logtoFile : function(message) {
			console.log("logging to file: " + logfile);
			fs.appendFile(logfile, message + "\n", function(err) {
				if (err) {
					throw err;
				}

			})
		},

		actualmsg : function(message) {
			console.log("logging actual msg to file: " + logfile);
			fs.appendFile(logfile, "Actual Result= " + message + "\n",
					function(err) {
						if (err) {
							throw err;
						}

					})
		},

		expectedmsg : function(message) {
			console.log("logging expected msg to file: " + logfile);
			fs.appendFile(logfile, "Expected Result= " + message + "\n\r",
					function(err) {
						if (err) {
							throw err;
						}
					})
		}



	}