var fs = require('fs');
var exec = require('child_process').exec;

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};

deleteFolderRecursive('docs');

exec("jsdoc -c build/doc-conf.json -t build/doc-template -r", function(err,stdout,stderr) {
    if(err) {
        console.log('get weather api error:'+stderr);
    } else {
        console.log('jsdoc build complete !');
    }
});
