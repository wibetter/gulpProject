# gulpProject: gulp前端代码工程化管理工具

## 使用方法一：以命令行方式使用gulpProject

- **全局安装**

```bash
#安装
npm i -g git+ssh://git@github.com:wibetter/gulpProject.git
```

```bash
#初始化项目配置
gulpProject init -n=yourProjectName

#或者：使用精简配置初始化项目
gulpProject init -n=yourProjectName --isSimplify=true
```

- **示例：以全局命令方式构建项目**

```bash
# 1、以本地开发环境编译代码
在命令窗口输入：gulpProject dev

# 2、以线上测试环境编译代码
在命令窗口输入：gulpProject test

# 3、以线上正式环境编译代码
在命令窗口输入：gulpProject online
```

## 使用方法二：以插件方式使用gulpProject

- **全局安装**

```bash
#安装
npm i -g git+ssh://git@github.com:wibetter/gulpProject.git
```

```bash
#初始化项目配置
gulpProject init -n=yourProjectName

#或者：使用精简配置初始化项目
gulpProject init -n=yourProjectName --isSimplify=true
```

- **本地安装**

```bash
#安装
npm i git+ssh://git@github.com:wibetter/gulpProject.git --save-dev
```

- **命令行方式使用示例**

```bash
// 以本地开发环境编译代码
>npm run dev;
// 以线上测试环境编译代码
>npm run test;
// 以线上正式环境编译代码
>npm run build;
```

- **组件方式使用示例**

```bash
# 引入gulpProject
const gulpProject = require('gulpProject');
// 以本地开发环境编译代码
gulpProject.dev();
// 以线上测试环境编译代码
gulpProject.test();
// 以线上正式环境编译代码
gulpProject.online();
```

- **创建系统模板**

```bash
gulpProject create -template=default #目前只有default模板
或者 gulpProject create
```
