/**
 * Created by SJH on 2020/8/26.
 */
module.exports = {
    apps: [{
        // 生产环境
        name: "prod-implant",
        // 项目启动入口文件
        script: "./bin/www",
        // 项目环境变量
        env: {
            "PORT": 80
        }
    }
    ]
}