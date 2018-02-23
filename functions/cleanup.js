var _ = require('underscore');
var fs = require('fs');

const common = fs.readFileSync(__dirname + "/popular.txt", {encoding: 'utf8'}).split("\n");
console.log(common.length)


function parseCMU(str) {
    var pronunciations = [];
    var phonesList = [];
    _.each(str.split("\n"), function(line) {
      if (/^;/.test(line)) { return; }
      
      if (line.length == 0) { return; }
      var parts = line.split("  ");
      var word = parts[0].toLowerCase();

      var phones = parts[1];
     if((! /\(\d\)$/.test(word)) && common.includes(word) && ! phonesList.includes(phones)) { 
      pronunciations.push(word+'  '+phones);
      phonesList.push(phones);
     }
    });
    return pronunciations;
  }
  
  var pronunciations = parseCMU(fs.readFileSync(__dirname + "/cmudict-0.7b", {encoding: 'utf8'}));
  console.log(pronunciations.length);

  //console.log(pronunciations);

  const path = "test_write.txt";

let data = pronunciations.join("\n");

  fs.writeFile(path, data, function(error) {
    if (error) {
      console.error("write error:  " + error.message);
    } else {
      console.log("Successful Write to " + path);
    }
});