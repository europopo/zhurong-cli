#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

program
.command('create <app-name>')
.description('create a new project')
.option('-f, --force', 'overwrite target directory if it exist')
.action((name, options) => {
    require('../lib/create.js')(name, options)
    // console.log('name:', name, 'options', options);
})

program
.command('config [value]')
.description('inspect and modify the config')
.option('-g, --get <path>', 'get value from option')
.option('-s, --set <path> <value>')
.option('-d, --delete <path>', 'delete option from config')
.action((value, options) => {
    console.log(value, options)
})

program
.command('ui')
.description('start add open roc-cli ui')
.option('-p, --port <port>', 'Port used for the UI Server')
.action((option)=> {
    console.log(option)
})

program
// 设置版本号信息
.version(`v${require('../package.json').version}`)
.usage('<command> [option]')

program
.on('--help', ()=> {
    console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`);
})

program
.on('--help', ()=> {
    console.log('\r\n' + figlet.textSync('zhurong', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));

    console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)} show details\r\n`)
})

// 解析用户执行命令传入参数
program.parse(process.argv);