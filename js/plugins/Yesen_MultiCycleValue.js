//0.Author = Yesenmidnight
//1.Cache No. = 缓存变量
//2.Download = 下载所有缓存变量到本地Config文件
//3.Continue = 载入所有缓存过的变量
(function(){
    function MCVArray(){
        this.MCV = [];
        this.set = function (x) {
            var index=Number(x);
            var value = $gameVariables.value(index);
            this.MCV[index]=value;
        };
        this.applyData=ConfigManager.applyData;
        this.loadConfig=function(config){
            if(config.myData!=undefined)
            this.MCV=config.myData;
        };
        this.pluginCommand=Game_Interpreter.prototype.pluginCommand;
        this.Continue=function(){
            ConfigManager.load();
            if(this.MCV==undefined)return;
            for (var i = 0; i < this.MCV.length; i++)
            {
                if(this.MCV[i]==null)continue;
                $gameVariables.setValue(i,this.MCV[i]);
            }
        }
    }
    var Y_Array=new MCVArray();
    ConfigManager.save = function() {
        var config=this.makeData();
        if(config.myData!=Y_Array.MCV)
            config.myData=Y_Array.MCV;
        console.log(JSON.stringify(config));
        StorageManager.save(-1, JSON.stringify(config));
    };
   ConfigManager.applyData = function (config) {
        Y_Array.applyData.call(this, config);
        Y_Array.loadConfig(config);
    };
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        Y_Array.pluginCommand.call(this, command, args);
        if (command === 'Cache') {
            Y_Array.set(args);
        }
        if(command==='Download'){
            ConfigManager.save();
        }
        if(command==='Continue'){
            Y_Array.Continue();
        }
    };
}());
