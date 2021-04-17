//=============================================================================
// moreMessage.js
//=============================================================================

/*:
 * @plugindesc ���봰���л�
 * @authorw wangwang
 * 
 * 
 * @help 
 *  
 * 
 * SceneManager._scene.setMessage(name) 
 * name Ϊ�ַ��� ����Ϊ�� Ϊ��ʱΪ������
 * �л����������(���û���򴴽�)
 * SceneManager._scene.delMessage(name) 
 * name Ϊ�ַ���  ɾ���Ǹ����� 
 * 
 * SceneManager._scene.closeMessage(name) 
 * name Ϊ�ַ���  �ر��Ǹ�����(��,��ɾ����ɶ������....)
 *  
 * Ĭ���½����ڲ��������ر�,�л�֮��᲻�ٸ���
 * 
*/


function Window_MessageClone() {
    this.initialize.apply(this, arguments);
}


/**����ԭ��  */
Window_MessageClone.prototype = Object.create(Window_Message.prototype);
/**���ô����� */
Window_MessageClone.prototype.constructor = Window_MessageClone;

Window_MessageClone.prototype.update = function () {
    if (!this._messagestop) {
        Window_Message.prototype.update.call(this);
    }
}

/**��ֹ��Ϣ */
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
        //��Ӵ���(��Ϣ����)
        this.addWindow(w);
        ///��Ϣ���� ��������() ��ÿһ�� ����
        w.subWindows().forEach(function (window) {
            //��Ӵ���(����)
            this.addWindow(window);
        }, this);
        this._messageWindows[name] = w
        w._messagestop = true
        w._notclose = true 
    }
};

//������Ϣ
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
	//��Ϣ���� = �� ������Ϣ
    this._messageWindow = new Window_MessageClone();
    //��Ӵ���( ��Ϣ���� ) 
    this.addWindow(this._messageWindow);
    //��Ϣ���� �������� ��ÿһ�� ���� 
    this._messageWindow.subWindows().forEach(function(window) {
	    //��Ӵ���(����)
        this.addWindow(window);
    }, this);
};