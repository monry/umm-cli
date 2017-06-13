var fs = require('fs');
var path = require('path');

module.exports = {
  getCurrentDirectoryName: function() {
    return path.basename(process.cwd());
  },
  isDirectoryExists: function(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  }
};