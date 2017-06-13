const fs = require('fs');
const path = require('path');

module.exports = {
  getCurrentDirectoryName: () => {
    return path.basename(process.cwd());
  },
  isDirectoryExists: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  }
};