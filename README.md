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

## 使用注意事项：
```bash
1、自带的系统模板、项目配置文件和gulpProject的配置文件中的静态资源根路径默认是//ssfe.test.sina.com.cn，请将其改成自己的静态资源引用地址;
2、使用gulpProject init -n yourProjectName 后，会生成默认的gulpProject配置文件，各位可以根据自己喜好进行调整;
3、gulpProject将系统分成三个环境：本地开发环境、线上测试环境和线上正式环境，
   其中最明显的区别是，不同的运行环境，项目的静态资源引用地址会被替换成相对应环境下的引用地址；
```
