/**
 * Created by Raphael Edwards.
 */

var fs = require('fs');
var csv = require('csv-streamify');
var config = require('./dataconfig');
var konga = require('konga');
var data = config.confData;
/*var readData = [];
var field1 = [];
var field2 = [];
var field3 = [];
var field4 = []; */
module.exports = {
    
	validatefileexists : function(filename) {
		return fs.exists(filename, function(exists) {
			if (exists) {
                            console.log("Test data file found @" + filename);				 
			}
			else {
                            console.log("Test data file NOT found @" + filename);
                            konga.logtoFile("Test data file NOT found @" + filename);
                            driver.quit();
			}
		});
	},
        readDataFromCSV : function(filePath ,key){
                var fstream = fs.createReadStream(filePath)
                .on('err', function(err) {
                    console.log("Error getting data from file " + filePath);
                    console.log(err);
                });

        var parser = csv({
            objectMode: true
        });
        // emits each line as a buffer or as a string representing an array of fields
        parser.on('readable', function() {            
            data.dataFile.total_records++;            
            var line = parser.read();            
            if ("" != line) {
            	console.log("line= ",line)
                var readData = line.toString().split(',');                               
                var i=0;                              
                var address= key;                                               
                for(var k in address)
                {
                    if(address[k])
                    {
                     address[k].push(readData[i]);   
                     i++;
                    }
                 }
                //console.log(address.state +">>"+ address.lga+">>>"+address.heavy);                               
            } else {
                console.log("Empty line found in data");
            }
        });
        parser.on('end', function() {
            //console.log(module.exports.confData['lga_csv']['total_records']);
            console.log('total records :: '+ data.dataFile.total_records);      
           
            return false;
            console.log("done reading file");
            console.log("Starting test");
        });        
        // now pump some data into it (and pipe it somewhere else)
        fstream.pipe(parser);
     }
}

 