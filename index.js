/**
 * Update by hai.xiong on 17/11/01.
 * 自动路由
 * 可以根据map内容自动启用别名
 */

var path = require('path');
var fs = require('fs');

var jsExtReg = /\.js$/,
    indexReg = /index$/;

function getPath(filePath, file) {
    return path.normalize(path.join(filePath, file));
}

function findRouter(routesPath, list) {

    var fileList = fs.readdirSync(routesPath);
    fileList.forEach(function (file) {
        //判断是以 .js 结尾的才是router,否则是目录
        var filePath = getPath(routesPath, file);
        if (jsExtReg.test(file)) {
            list.push(filePath);
        } else if(fs.lstatSync(filePath).isDirectory()) {
            findRouter(filePath, list);
        }
    });

}

/**
 * 根据map替换path的开始字段
 * @param path
 * @param map
 * @returns {*}
 */
function mapTheNewRouter(path, replaceMap) {

    for (var str in replaceMap || {}) {
        if (path.startsWith(str)) {
            // 替换并去掉多余的/
            return path.replace(str, replaceMap[str]).replace(/(\/)+/g, '$1');
        }
    }

    return path;
}


/**
 * 自动路由初始化操作
 * @param app app对象
 * @param opt 路由配置
 *          routesPath routes的路径
 *          alias 需要替换的路由
 */
exports.init = function (app, opt) {

    var routesPath = opt.routesPath,
        replaceMap = opt.alias,
        fileList = [];

    // 获取所有的路由文件
    findRouter(routesPath, fileList);

    fileList.forEach(function (filePath) {

        var route = require(filePath);

        // 删掉routesPath、
        // 删除文件后缀、
        // 删掉结尾的index
        // 替换掉\到/
        filePath = filePath
            .replace(routesPath, '')
            .replace(jsExtReg, '')
            .replace(indexReg, '')
            .replace(/\\/g, '/');

        filePath = mapTheNewRouter(filePath, replaceMap);

        app.use(filePath, route);
    });

    app = fileList = null;
};