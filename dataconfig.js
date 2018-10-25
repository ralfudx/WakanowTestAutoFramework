/**
 * Created by Raphael Edwards.
 */

//running singe file. Figure out running suite
var fs = require('fs');
var path = require('path');
var execFile = process.argv[3];
var execFileName = execFile+ '.json';
var basedir =process.cwd();
//var execFileName=path.dirname(execFile);
//var dir = path.dirname(execFile);
// var configFileName = dir + path.sep + execFileName + '.json';
var configFileName = basedir + path.sep + execFileName;

var confData = {};
//console.log('execFile: '+execFile)
//console.log('execFilename: '+execFileName)

try {
	confData = fs.readFileSync(configFileName, 'utf8');
} catch (e) {
	if (e.code === 'ENOENT') {
		//console.log('config File not found in '+ basedir);
	    execFileName = path.dirname(execFile)+'.json';
		//console.log('execFilename: '+execFileName);
		configFileName=basedir + path.sep + execFileName;
		

		try {
			confData = fs.readFileSync(configFileName);

		} catch (e) {
			if (e.code === 'ENOENT') {
				console.log('config File not found in '+ basedir);
				execFile=process.argv[1];
				execFileName = path.basename(execFile)+'.json';
				console.log('execFilename: '+execFileName)
				configFileName=basedir + path.sep + execFileName;
		
				try{
					confData = fs.readFileSync(configFileName);
				}
				catch (e) {
					if (e.code === 'ENOENT') {
						console.log('config File not found in ', configFileName)
					}
				}
			}
		}
	}

	else {
		throw e;
	}
	
}

if (confData) {
	// console.log(confData);
 confData = JSON.parse(confData);
	// console.log(confData);
}
module.exports={
		confData:confData,
		home:confData.homeurl
		

}