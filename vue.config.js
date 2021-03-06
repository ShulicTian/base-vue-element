const path = require('path');
module.exports = {
    // baseUrl: './',
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    chainWebpack: config => {
        config.output.filename('[name].[hash].js').end();
    },
    devServer: {
        port: 8083,
        proxy: {
            '/osmp': {
                target: 'http://localhost:9701/osmp',
                pathRewrite: { '^/osmp': '/' }
            }
        }
    },
    configureWebpack: {
        name: 'sign',
        resolve: {
            alias: {
                '@': resolve('src'), // 主目录
                'components': resolve('src/components'), // 组件
                'api': resolve('src/api'), // 接口
                'utils': resolve('src/utils'), // 通用功能
                'assets': resolve('src/assets')
            }
        }
    }
};

function resolve(dir) {
    return path.join(__dirname, dir);
}
