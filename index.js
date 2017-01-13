var _=require('lodash');
    fs=require('fs'),
    path=require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    fs=require('fs'),
    i18n=require('i18n');

/**
 * 通过webpack使用i18n插件
 * 
 * 获取中文时,html通过html-webpack-plugin产生
 * 
 */

function Plugin(options) {
    i18n.config=options;
}

Plugin.prototype.apply = function(compiler) {

    //所有中文
    var arrays=[];
    var htmlPlugins=_.filter(compiler.options.plugins,function(v){
        return v instanceof HtmlWebpackPlugin;
    })
   
    var _callback=_.after(htmlPlugins.length,function(){
        //只创建字典
        i18n.makeDitByWords(arrays);
    })

    //读取js系列中文
    compiler.plugin('emit', function(compilation, callback) {
        var assets=compilation.getStats().compilation.assets;
        _.each(assets,function(asset,k){
            if(i18n.checkedFile(k)){
                var text=asset.source()
                var array=i18n.scanWordByText(text);
                arrays.push(array);
            }
        })
        callback();
    });

    //读取html系列中文
    compiler.plugin('compilation', function(compilation, options) {
        compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
            var array=i18n.scanWordByText(htmlPluginData.html);
            arrays.push(array);
            _callback();
            callback(null, htmlPluginData);
        });
    });
};

module.exports = Plugin;