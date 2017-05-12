var inquirer    = require('inquirer');
var fs    = require('fs');
var path  = require('path');

var files = require('../../lib/files');

module.exports = function(argv) {
  var this_ = this;
  this._validate = function() {
    // 第二引数が渡されている場合はソレをパッケージ名として扱う
    if (1 < argv._.length) {
      argv.name = argv._[1];
      argv.n = argv._[1];
    }

    // カレントディレクトリ以下にパッケージ名のディレクトリが存在している場合はエラー
    var base_directory_path = path.join(process.cwd(), argv.name);
    if (files.isDirectoryExists(base_directory_path)) {
      console.error(chalk.red('ERROR: Directory `' + base_directory_path + '` has already exists!'));
      return false;
    }

    // カレントディレクトリ内に package.json がある場合、 upm がネストする疑いがあるので、本当に実行して良いか聞く
    if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      inquirer
        .prompt(
          [
            {
              type: 'confirm',
              name: 'nestedUPM',
              message: 'This directory seems to have already been upm package.',
              default: false
            }
          ]
        )
        .then(
          function(answers) {
            if (answers['nestedUPM']) {
              this_._execute();
            }
          }
        );
      // inquirer の promise 内部で呼び出すため、 false を返す
      // もっと良いやり方ありそう...
      return false;
    }
    return true;
  };
  this._execute = function() {
    console.log(argv);
  };

  if (this._validate()) {
    this._execute();
  }
};
