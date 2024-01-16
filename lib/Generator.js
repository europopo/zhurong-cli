const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const chalk = require('chalk')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用ora初始化，传入提示信息message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();

    try {
        // 执行传入方法 fn
        const result = await fn(...args)
        // 状态未修改为成功
        spinner.succeed();
        return result;
    } catch (error) {
        // 状态修改为失败
        spinner.fail('Request failed, refetch ...');
        throw error;
    }
}


class Generator {
    constructor(name, targetDir){
        // 目录名称
        this.name = name;
        // 创建的目录
        this.targetDir = targetDir;

        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async getRepo() {
        // 获取模板数据
        const repoList = await wrapLoading(getRepoList, "waiting fetch template")
        if(!repoList) return;

        // 过滤我们需要的模板名称
        const repos = repoList.map(item => item.name);

        // 选择模板
        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'Please choose a template to create project'
        })

        // 返回模板名称
        return repo;

    }

    async getTag(repo) {
        // 基于repo结果拉取对应的tag列表
        const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
        if(!tags) return;

        // 过滤我们需要的tag名称
        const tagsList = tags.map(item => item.name);

        // 用户选择自己需要下载tag
        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: 'Please choose a tag to create project'
        })

        return tag;
    }

    async download(repo, tag) {
        // 拼接下载地址
        const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`;

        // 下载
        await wrapLoading(
            this.downloadGitRepo,
            'waiting download template',
            requestUrl,
            path.resolve(process.cwd(), this.targetDir)
        )

    }

    // 创建文件夹
    async create() {
        const repo = await this.getRepo();

        const tag = await this.getTag(repo);

        await this.download(repo, tag);

        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
        console.log('  npm run dev\r\n');
    }
}

module.exports = Generator;