const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const Generator = require('./Generator')


module.exports = async function(name, options) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name)
    // 目录是否已经存在
    if (fs.existsSync(targetAir)) {
        // 是否强制创建
        if(options.force) {
            await fs.remove(targetAir)
        } else {
            // 询问用户是否要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Target directory already exists Pick an action:',
                    choices: [
                        {
                            name: 'Overwrite',
                            value: 'overwrite',
                        },{
                            name: 'Cancel',
                            value: false
                        }
                    ]
                }
            ])
            if(!action) {
                return;
            } else if (action === 'overwrite') {
                console.log(`\r\nRemoving...`)
                await fs.remove(targetAir)
            }
        }
    }

    const generator = new Generator(name, targetAir)
    generator.create()
}