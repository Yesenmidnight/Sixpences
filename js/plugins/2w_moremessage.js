//=============================================================================
// moreMessage.js
//=============================================================================

/*:
 * @plugindesc 输入窗口切换
 * @authorw wangwang
 * 
 * 
 * @help 
 *  
 * 
 * SceneManager._scene.setMessage(name) 
 * name 为字符串 或者为空 为空时为主窗口
 * 切换到这个窗口(如果没有则创建)
 * SceneManager._scene.delMessage(name) 
 * name 为字符串  删除那个窗口 
 * 
 * SceneManager._scene.closeMessage(name) 
 * name 为字符串  关闭那个窗口(额,和删除有啥区别吗....)
 *  
 * 默认新建窗口不会主动关闭,切换之后会不再更新
 * 
*/


function Window_MessageClone() {
    this.initialize.apply(this, arguments);
}


/**设置原形  */
Window_MessageClone.prototype = Object.create(Window_Message.prototype);
/**设置创造者 */
Window_MessageClone.prototype.constructor = Window_MessageClone;

Window_MessageClone.prototype.update = function () {
    if (!this._messagestop) {
        Window_Message.prototype.update.call(this);
    }
}

/**终止消息 */
Window_MessageClone.prototype.terminateMessage = function () {
    if (!this._notclose) {
        
        this.cloneClose();
    }
    $gameMessage.clear();
};


Window_MessageClone.prototype.cloneClose = function () { 
    this.close();
    this._goldWindow.close(); 
};

Scene_Base.prototype.addMessage = function (name) {
    this._messageWindows = this._messageWindows || {}
    if (!this._messageWindows[name]) {
        var w = new Window_MessageClone();
        //添加窗口(消息窗口)
        this.addWindow(w);
        ///消息窗口 辅助窗口() 对每一个 窗口
        w.subWindows().forEach(function (window) {
            //添加窗口(窗口)
            this.addWindow(window);
        }, this);
        this._messageWindows[name] = w
        w._messagestop = true
        w._notclose = true 
    }
};

//设置信息
Scene_Base.prototype.setMessage = function (name) {
    this._messageWindows = this._messageWindows || {}
    if (!this._messageWindows[name]) {
        this.addMessage(name)
    }
    console.log(name)
    for (var i in this._messageWindows) {
        if (i == name) {
            this._messageWindows[i]._messagestop = false
        } else {
            this._messageWindows[i]._messagestop = true
        }
    }
    if (name == undefined) {
        this._messageWindow._messagestop = false
    } else {
        this._messageWindow._messagestop = true
    }
};

Scene_Base.prototype.delMessage = function (name) {
    this._messageWindows = this._messageWindows || {}
    var w = this._messageWindows[name]
    if (w) {
        w.subWindows().forEach(function (window) {
            this._windowLayer.removeChild(window)
        }, this);
        this._windowLayer.removeChild(w)
        delete this._messageWindows[name] 
    }
};

Scene_Base.prototype.closeMessage = function (name) {
    this._messageWindows = this._messageWindows || {}
    var w = this._messageWindows[name]
    if (w) {
        w.cloneClose()
    }
};


Scene_Base.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageClone();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function (window) {
        this.addWindow(window);
    }, this);
};

Scene_Map.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageClone();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function (window) {
        this.addWindow(window);
    }, this);
};
 

Scene_Battle.prototype.createMessageWindow = function() {
	//消息窗口 = 新 窗口消息
    this._messageWindow = new Window_MessageClone();
    //添加窗口( 消息窗口 ) 
    this.addWindow(this._messageWindow);
    //消息窗口 辅助窗口 对每一个 窗口 
    this._messageWindow.subWindows().forEach(function(window) {
	    //添加窗口(窗口)
        this.addWindow(window);
    }, this);
};