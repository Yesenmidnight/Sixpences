//=============================================================================
// saveOnPathwww.js
//=============================================================================
/*:
 * @plugindesc 保存时如果是打包pc端www文件夹的时候,放到与www同级文件夹里
 * @author wangwang
 * 
 * 
 * @help 
 * 
 * 保存时如果是打包pc端www文件夹的时候,放到与www同级文件夹里
 * 
 * */
StorageManager.localFileDirectoryPath = function () { 
    if (Utils.isOptionValid('test')) {
        var path = require('path');
        var base = path.dirname(process.mainModule.filename);
        return path.join(base, 'save/');
    } else {
        var path = require('path');
        var base = path.dirname(process.mainModule.filename)
        var fa = path.basename(base)
        if (fa == "www") {
            var base = path.dirname(base);
        }
        return path.join(base, 'save/');
    }
};
