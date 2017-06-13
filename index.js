#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const argv = require('minimist')(
  process.argv.slice(2),
  {
    string : [
      'name'
    ],
    boolean: [],
    alias  : {
      n: 'name'
    },
    default: {
      name: ''
    },
  }
);

const command_list = [
  'new',
];

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Welcome to umm !', { horizontalLayout: 'full' })
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

