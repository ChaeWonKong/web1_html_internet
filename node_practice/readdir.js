const testFolder = '../web1/data/';
const fs = require('fs');

fs.readdir(testFolder, function(err, filelist) {
	console.log(filelist);
});