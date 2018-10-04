var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var SPREADSHEETS_DIR = '/Users/mirabelenkiy/Documents/Dev/centre-tokens/verification/Spreadsheets'

function UnitTest(code, description, pending){
    this.code = code;
    this.description = description;
    this.pending = pending;
}

/*
 UnitTestDirectory is a literal object.
    Keys - names of unit test files
    Values - a UnitTestSet

 UnitTestSet is a literal object
    Keys - codes associated with unit tests
    Values - an instance of a UnitTest object
*


/**
* Reads all files in Spreadsheets directory and returns an oject with their contents
* Returns a UnitTestDirectory object
* TODO: handle errors, null objects, UnitTestCompleteness
*/
function load() {
    var unitTestDirectory = {};

    // get names of all files in SPREADSHEETS_DIR
    var files = fs.readdirSync(SPREADSHEETS_DIR, (err, data) => {
        if(err){
            console.log("error reading " + SPREADSHEETS_DIR + " " + err);
            return null;
        }
        return data;
    });
    // process each file into a unitTestSet, then add the
    // unitTestSet to unitTestDirectory
    files.forEach(file => {
        console.log('reading ' + file);
        var csvFileContents = fs.readFileSync(SPREADSHEETS_DIR + "/" + file, "utf8");
        if(csvFileContents != null) {
            var unitTestSet = {};
            var spreadsheet = parse(csvFileContents, {columns: true});
            spreadsheet.forEach(row => {
                var unitTest = parseRow(row);
                unitTestSet[unitTest.code] = unitTest;
            });
            var unittestfilename = getUnitTestFileName(file);
            unitTestDirectory[unittestfilename] = unitTestSet;
        }
    });

    // return array of unitTestDirectory objects
    return unitTestDirectory;
}

//
// spreadsheet: UnitTestDirectory
function isPending(spreadsheet, filename, code) {
    if((filename in spreadsheet ) && (code in spreadsheet[filename]))
    {
        return spreadsheet[filename][code].pending;
    }
    return false;
}

// Transforms a row in spreadsheet into a UnitTest object
// row: a literal object. One of the keys must be 'code/Code' and another 'description/Description'
// Returns a UnitTest object or null if cannot find appropriate keys.
function parseRow(row) {
    var test_code = "";
    var testCodeKey = "";
    var pending = false;
    var description = "";
    for(var columnName in row) {
        if(columnName == 'code' || columnName == 'Code') {
            test_code = row[columnName];
            testCodeKey = columnName;
            pending = test_code.match(/ -p/);
            if (pending) {
                test_code = test_code.replace(pending[0], '');
                pending = true;
            } else {
                pending = false;
            }
        }
    }
    var descriptionKey = getDescriptionKey(row, testCodeKey);
    description = row[descriptionKey];
    if(test_code == '' || description == '') return null;
    return new UnitTest(test_code, description, pending);
}

function getDescriptionKey(row, testCodeKey) {
    // get the index of the testCodeKey
    var testCodeKeyIndex = 0;
    for(var i=0; i<Object.keys(row).length; ++i) {
        if(Object.keys(row)[i] == testCodeKey) {
            return Object.keys(row)[i+1];
         }
    }
    // return last column
    return Object.keys(row)[i];;
}

// Returns the raw name of the unit test file associated with this csv file
// csvFileName: filename in the format `/path/to/file/spreadsheetname - unittestfilename.csv`
// returns unittestfilename
function getUnitTestFileName(csvFileName) {
    var filenames = csvFileName.split(/ - /);
    if(filenames.length != 2) {
        console.log("failed to split " + csvFileName)
        return '';
    }
    var unitTestFileName = filenames[filenames.length - 1].replace(/\.csv/, "" );
    return unitTestFileName;
}


module.exports = {
  load: load,
  UnitTest: UnitTest,
  isPending: isPending,
}
