webpack 将资源打包进内联进html

```js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin')

module.exports = {
    entry: './demo06/index.js',  // 入口文件路径
    output: {
        filename: 'bundle.js',  // 输出文件名
        path: path.resolve(__dirname, 'dist')  // 输出目录路径
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './demo06/index.html', // 指定HTML模板文件
            filename: 'index.html', // 指定输出的HTML文件名
            inject: 'body', // 默认值：true。确定脚本和样式的位置，可以设置为"head"或"body"
            // inlineSource: '.(js|css)$', // 这里我会注入所有的css和js到html中，也可以根据需求修改正则，只注入部分文件，实测没有用
            minify: { // 可选：压缩HTML文件
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyJS: true,
                minifyCSS: true
            }
        }),
        new HtmlInlineScriptPlugin()
    ],
    devServer: {
        static: './dist',
        open: true,  // 自动打开浏览器
        port: 8080,  // 端口号
        hot: true  // 热更新
    }
}


```
