## 脱坑
已放弃,此处国际化描述的是如何用webpack查找中文,并进行其他语言的替换

产生,来自于项目组的临时需求,属于临时+意外的方案
## i18n-webpack
通过webpack的方式,调用i18n抽取中文,并进行转换

```javascript
new I18nWebpack({
    //扫描文件地址
    dist:path.join(__dirname,'../dist'),
    //源码
    src:path.join(__dirname,'../src'),
    //字典地址
    dic:path.join(__dirname,'../locale/i18n.json'),
    type:['html','js','ejs'],
    locale:['en'],
    translate:false//使用网络翻译
})
```