# node-auto-routes
express 项目自动路由插件

alias 别名 可以重命名路由

```
var AutoRoutes = require("./AutoRoutes");

AutoRoutes.init(app, {
    routesPath: config.routes,
    alias: {
        '/mockData': '/'
    }
});
```