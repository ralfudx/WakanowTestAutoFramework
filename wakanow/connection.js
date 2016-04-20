var mysql = require('mysql');
var data = {};
var suiteid_data={};
 module.exports ={
    connection:null,
    data:null,
    suiteid_data:null,
    insertId:null,
    affectedRows:null,
    passcount:null,
    failcount:null,
    last_status:null,
    driver:null,
    addDriver:function(driver){
        module.exports.driver = driver;
    },
    createConnection:function(){
        module.exports.connection = mysql.createConnection({
            host     : "localhost",
            user     : "root",
            password : "",
            database : "wakanow"
        });
        try{
            module.exports.connection.connect(function(err){
                if(err)
                    throw err;
            });
        }catch(e){
            console.log("Failed to connect DB" , e);
        }
    },
    getSuiteIdFromSuites:function(suitename,productname){
        var suite_ids = {};
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var query = 'SELECT suite_id FROM suites WHERE suite_name = "'+suitename+'" AND product = "'+productname+'"';
        try{
            module.exports.connection.query(query, function(err, rows, fields) {
                if (err) throw err;
                for(var i in rows){
                    suite_ids[i] = rows[i];
                }
                if(suiteid_data){
                    module.exports.suiteid_data = suite_ids;
                    suiteid_data = suite_ids;
                }
            });
        }catch(e){
            console.log('Failed to create a connection '+e);
        }
    },
    insertNewSuiteInToSuites: function(suiteDetailsArray){
        module.exports.insertId = null;
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var queryString = 'INSERT INTO suites SET ?';
        try{
            module.exports.connection.query(queryString,suiteDetailsArray, function(err, result) {
                if (err) throw err;
                module.exports.insertId = result.insertId;
            });
        }catch(e){
            console.log('Failed to insert '+e);
        }
    },
    getTestBuildsFromName:function(testName,product,suiteId){
        console.log("ENTERED");
        var test_builds = {};
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var queryString = 'SELECT test_id FROM test_builds WHERE test_name = "'+testName+'" AND product = "'+product+'" AND suite_id = '+suiteId;
        try{
            module.exports.connection.query(queryString, function(err, rows, fields) {
                if (err) throw err;
                for (var i in rows) {
                    test_builds[i] = rows[i];
                }
                if(data){
                    module.exports.data = test_builds;
                    data = test_builds;
                }
            });
        }catch(e){
            console.log('Failed to create a connection '+e);
        }
    },
    insertTest_Build:function(testName,product,start_time,suiteid){
        module.exports.insertId = null;
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var insert_arr = {
            'test_name':testName,
            'suite_id':suiteid,
            'product':product,
            'date_added':start_time,
            'last_executed_date':start_time,
            'total_pass':0,
            'total_failures':0,
            'last_executed_status':''
        };
        var queryString = 'INSERT INTO test_builds SET ?';
        try{
            module.exports.connection.query(queryString,insert_arr, function(err, result) {
                if (err) throw err;
                module.exports.insertId = result.insertId;
            });
        }catch(e){
            console.log('Failed to insert '+e);
        }
    },
    updateTest_Build:function(testName,product,update_arr,suite_id){
        module.exports.affectedRows = null;
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var queryString = "Update test_builds SET ? WHERE test_name = '"+testName+"' AND product = '"+product+"' AND suite_id = "+suite_id;
        console.log("QUry :: "+queryString);
        try{
            var query = module.exports.connection.query(queryString,update_arr, function(err, result) {
                if (err) throw err;
                module.exports.affectedRows = result.affectedRows;
            });
            module.exports.driver.sleep(500);
        }catch(e){
            console.log('Failed to update query '+e);
        }
    },
    insertTest_Build_Results:function(testId,browser,start_time){
        module.exports.insertId = null;
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var insert_arr = {
            'test_id':testId,
            'test_start_date':start_time,
            'status':'running',
            'browser_used':browser
        };
        var queryString = 'INSERT INTO test_build_results SET ?';
        try{
            module.exports.connection.query(queryString,insert_arr, function(err, result) {
                if (err) throw err;
                module.exports.insertId = result.insertId;
            });
        }catch(e){
            console.log('Failed to insert a record in to test_build_results table '+e);
        }
    },
    updateBuild_Results:function(testId,update_arr){
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var queryString = 'Update test_build_results SET ? WHERE id = "'+testId+'"';
        try{
            var query = module.exports.connection.query(queryString,update_arr, function(err, result) {
                if (err) throw err;
                module.exports.affectedRows = result.affectedRows;
            });
            module.exports.driver.sleep(500);
        }catch(e){
            console.log('Failed to update query '+e);
        }
    },
    updateStatus_Build_Results:function(update_arr){
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        var queryString = 'Update test_build_results SET ? WHERE status = "running"';
        try{
            var query = module.exports.connection.query(queryString,update_arr, function(err, result) {
                if (err) throw err;
                module.exports.affectedRows = result.affectedRows;
            });
            module.exports.driver.sleep(500);
        }catch(e){
            console.log('Failed to update query '+e);
        }
    },
    getPassAndFailCount:function(status,testid){
        if(module.exports.connection==null){
            module.exports.createConnection();
        }
        module.exports.count = null;
        var Query = "SELECT count('id') as Count FROM test_build_results WHERE status ="+"'"+status+"' && test_id = '"+testid+"'";
        try{
         module.exports.connection.query(Query, function(err, rows, fields) {
                if (err) throw err;
                for (var i in rows) {
                    if(status == 'passed'){
                        console.log("Pass Count ::: "+rows[i]['Count']);
                        module.exports.passcount = rows[i]['Count'];
                    }else{
                        console.log("fail count ::: "+rows[i]['Count']);
                        module.exports.failcount = rows[i]['Count'];
                    }
                }
         });
        }catch(e){
            console.log("Failed to get the count of Pass and Failed Records " , e);
        }
    },
    getLastExecutedStatus:function(testid){
      if(module.exports.connection==null){
        module.exports.createConnection();
      }
      var query = "SELECT status FROM test_build_results where id= '"+testid+"' ORDER BY id DESC LIMIT 1";
      try{
          module.exports.connection.query(query, function(err, rows, fields) {
                if (err) throw err;
                for (var i in rows) {
                    module.exports.last_status = rows[i]['status'];
                }
         });
      }catch(e){
          console.log("Failed to fatch lastExecutedDate " , e);
      }
    },
    getMysqlDate:function(){
        var date;
        date = new Date();
        date = date.getFullYear() + '-' +
            ('00' + (date.getMonth()+1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' +
            ('00' + date.getMinutes()).slice(-2) + ':' +
            ('00' + date.getSeconds()).slice(-2) + ':' +
            ('000' + date.getMilliseconds()).slice(-3);
        return date;
    }

}
