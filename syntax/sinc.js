var fs = require('fs');

console.log('readFileSync')
console.log('A')
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');

console.log('readFile');

//readFile
console.log('A')
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
	console.log(result);
});
console.log('C');