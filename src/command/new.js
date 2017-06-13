var inquirer = require('inquirer');
var fs       = require('fs');
var path     = require('path');
var Rx       = require('rx');

var files = require('../lib/files');

module.exports = function(argv) {
  // 第二引数が渡されている場合はソレをパッケージ名として扱う
  if (1 < argv._.length) {
    argv.name = argv._[1];
    argv.n = argv._[1];
  }

  var this_ = this;
  var prompts = new Rx.Subject();
  this.inquirerStream = inquirer.prompt(prompts).ui.process;

  this._prepare = function() {
    // 「nested な umm だけど良いの？」に対して No を回答した場合はプロセスを終了させる
    this_.inquirerStream
      .where(function(x) { return x.name === 'nestedUMM' && !x.answer; })
      .subscribe(function(_) { process.exit(); });
    this_.inquirerStream.subscribe(
      function(_) {},
      function(e) {},
      function() { console.log("Completed"); console.log(argv.name); }
    );
  };

  this._execute = function(prompts) {
    // カレントディレクトリ内に package.json がある場合、 umm がネストする疑いがあるので、本当に実行して良いか聞く
    if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      prompts.onNext(
        {
          type: 'confirm',
          name: 'nestedUMM',
          message: 'This directory seems to have already been umm package (already exists package.json). Are you sure to generate umm module?',
          default: false
        }
      );
    }
    // モジュール名の確認
    prompts.onNext(
      {
        type: 'input',
        name: 'module_name',
        message: 'Module name: ',
        default: argv.name,
        filter: function(answer) {
          argv.name = answer;
          argv.n = answer;
          return answer;
        },
        validate: function(answer) {
          var directory_path = path.join(process.cwd(), answer);
          if (files.isDirectoryExists(directory_path)) {
            return 'ERROR: Directory `' + directory_path + '` has already exists!';
          }
          return true;
        }
      }
    );
    prompts.onCompleted();
  };

  this._prepare();
  this._execute(prompts);
};
