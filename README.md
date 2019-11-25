## gulpProject: gulp版前端代码工程化管理工具
1. 适用于requireJs/jQuery/doT...技术栈；
2. 使用gulpProject实现前端代码工程化，不用花大把时间重构老技术栈项目代码。

笔者留言：本人主要用gulpProject管理requireJs/jQuery等老技术栈的前端项目代码。

### 一、使用方法一：以命令行方式使用gulpProject
注：此方式可用于同时管理多个前端项目代码

- **1、全局安装**

```bash
#安装
$ npm i -g git+ssh://git@github.com:wibetter/gulpProject.git
```

- **2、初始化项目配置(需要先进入指定项目根目录)**

```bash
$ gulpProject init -n=yourProjectName

#或者：使用精简配置初始化项目
$ gulpProject init -n=yourProjectName --isSimplify=true
```

注：  
1. 也可以自建gulpProject配置文件，
目前gulpProject默认从当前项目的根目录（或者config目录）中读取gulp-config.js作为gulpProject的配置文件；
2. 初始化项目配置后即可得到gulpProject的默认配置文件，您也可以根据项目需要自行更改gulpProject的对应配置文件。


- **3、示例：以全局命令方式构建项目**

初始化项目配置后就可以开始构建您的项目前端代码了

```bash
# 1、以本地开发环境编译代码
$ gulpProject dev
```

```bash
# 2、以线上测试环境编译代码
$ gulpProject test
```


```bash
# 3、以线上正式环境编译代码
$ gulpProject online
```

### 二、使用方法二：以插件方式使用gulpProject
注：只作用于当前项目

- **2.1、全局安装gulpProject**
注：需要先全局安装gulpProject，用于生成gulpProject的默认配置文件，
如果准备自建gulpProject的配置文件，可以不用全局安装。

```bash
$ npm i -g git+ssh://git@github.com:wibetter/gulpProject.git
```

- **2.2、初始化项目配置（同方法一）**

```bash
$ gulpProject init -n=yourProjectName
```

- **2.3、本地安装**

```bash
$ npm i git+ssh://git@github.com:wibetter/gulpProject.git --save-dev
```

- **2.4、gulpProject提供的本地执行命令**

```bash
# 以本地开发环境编译代码
$ npm run dev;
# 以线上测试环境编译代码
$ npm run test;
# 以线上正式环境编译代码
$ npm run build;
```

- **2.5、采用插件方式引用（示例）**

```bash
// 引入gulpProject
const gulpProject = require('gulpProject');
// 以本地开发环境编译代码
gulpProject.dev();
// 以线上测试环境编译代码
gulpProject.test();
// 以线上正式环境编译代码
gulpProject.online();
```

### 三、gulpProject提供的其他方法

- **3.1、创建系统模板**  
注：gulpProject自带一套前端项目代码模板，以便用户参考使用

```bash
$ gulpProject create -template=default #目前只有default模板

# 或者 
$ gulpProject create
```

- **3.2、输出当前项目配置文件**

```bash
$ gulpProject inspect 
```
注：将当前项目配置文件输出到current-gulp-config.js中，以便检查当前配置是否正常。

### gulpProject的使用注意事项
1. gulpProject将系统分成三个环境：本地开发环境、线上测试环境和线上正式环境
   （其中最明显的区别是，不同的运行环境，项目的静态资源引用地址会被替换成相对应环境下的引用地址）；
2. 自带的系统模板源代码中的静态资源根路径默认是//goodtool666.cn（仅用于本地开发环境）;
3. 使用gulpProject init -n yourProjectName 后，会生成默认的gulpProject配置文件，各位可以根据当前项目情况进行调整;

