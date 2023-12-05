const path = require('path');

module.exports = {
    entry: './index.js',  // 入口文件路径
    output: {
        filename: 'bundle.js',  // 输出文件名
        path: path.resolve(__dirname, 'dist')  // 输出目录路径
    }
};
