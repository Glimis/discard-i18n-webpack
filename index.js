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
    var self=this;
    i18n.readDit()
        .then(function(dit){
            self.dit=dit;
        })
}

Plugin.prototype.apply = function(compiler) {
    var self=this;
    if(i18n.config.mode!="create"){
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
    }else{
        //读取js系列中文
        compiler.plugin('emit', function(compilation, callback) {
            var assets=compilation.getStats().compilation.assets;
         
            var files=_.compact(_.map(assets,function(asset,k){
                
                if(i18n.checkedFile(k)){
                     var ps=   k.split('.') ;
                        ps[ps.length]=ps[ps.length-1];
                        ps[ps.length-2]="en";
                       
                    return {
                        fileName:ps.join('.'),
                        html:asset.source()
                    };
                }
            }))
         
            _.each(files,function(data){
                compilation.assets[data.fileName] = {
                  source: function() {
                    return i18n.createLocalFileByHtml(data.html,self.dit);
                  },
                  size:function(){
                    return 10
                  }
               }
            })

            // compilation.assets['filelist.md'] = {
            //       source: function() {
            //         return filelist;
            //       },
            //       size: function() {
            //         return filelist.length;
            //       }
            // };
            // var text=asset.source()
            //         var text=i18n.createLocalFileByHtmlDit(text,dit);
            callback();
        }); 

    }
};

module.exports = Plugin;