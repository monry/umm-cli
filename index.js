#!/usr/bin/env node

var chalk       = require('chalk');
var clear       = require('clear');
// var CLI         = require('clui');
var figlet      = require('figlet');
// var inquirer    = require('inquirer');
// var Preferences = require('preferences');
// var Spinner     = CLI.Spinner;
// var _           = require('lodash');
// var touch       = require('touch');
// var fs          = require('fs');
// var path        = require('path');

// var files       = require('./lib/files');

// var git         = require('simple-git')();
var argv        = require('minimist')(
  process.argv.slice(2),
  {
    string: [
      'name'
    ],
    boolean: [

    ],
    alias: {
      n: 'name'
    },
    default: {
      name: ''
    },
  }
);

var command_list = [
  'new',
];

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Welcome to upm !', { horizontalLayout: 'full' })
  )
);

if (0 === argv._.length) {
  // TODO: usage を表示する
  console.error(chalk.red('ERROR: Please specify the command.'));
  return 1;
}
if (0 > command_list.indexOf(argv._[0])) {
  // TODO: usage を表示する
  console.error(chalk.red('ERROR: Command `' + argv._[0] + '` does not defined.'));
  return 1;
}

// 該当するコマンドを実行
require('./src/command/' + argv._[0])(argv);

