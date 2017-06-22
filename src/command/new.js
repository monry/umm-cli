import * as inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import * as rx from 'rx';

import * as files from '../lib/files';

class Command {

  constructor(argv) {
    // 第二引数が渡されている場合はソレをパッケージ名として扱う
    if (1 < argv._.length) {
      argv.name = argv._[1];
      argv.n = argv._[1];
    }
    this.argv = argv;
    this.prompts = new rx.Subject();
    this.streamInquirer = inquirer.prompt(this.prompts).ui.process;
    this.questions = [];
  }

  run() {
    this.prepare();
    this.execute();
    this.questions.forEach(this.prompts.onNext);
    this.prompts.onCompleted();
  }

  prepare() {
    if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
      // カレントディレクトリ内に package.json がある場合、 umm がネストする疑いがあるので、本当に実行して良いか聞く
      this.questions.push(
        {
          type: 'confirm',
          name: 'nestedUMM',
          message: 'This directory seems to have already been umm package (already exists package.json). Are you sure to generate umm module?',
          default: false,
        }
      );
    }
    // モジュール名の確認
    this.questions.push(
      {
        type: 'input',
        name: 'module_name',
        message: 'Module name: ',
        default: this.argv.name,
        filter: (answer) => {
          this.argv.name = answer;
          this.argv.n = answer;
          return answer;
        },
        validate: (answer) => {
          const directory_path = path.join(process.cwd(), answer);
          if (files.isDirectoryExists(directory_path)) {
            return 'ERROR: Directory `' + directory_path + '` has already exists!';
          }
          return true;
        },
      }
    );
  }

  execute() {
    // 「nested な umm だけど良いの？」に対して No を回答した場合はプロセスを終了させる
    this.streamInquirer
      .where(x => x.name === 'nestedUMM' && !x.answer)
      .subscribe(_ => process.exit());
    this.streamInquirer
      .subscribe(
        _ => {},
        e => {},
        () => console.log('Completed!')
      );
  }

}

// 本来は export { } 構文を使うべきなんだろうけど、ヤヤコシイので module.exports で。
module.exports = Command;
