//=============================================================================
// PictureCallCommon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2015/12/20 �LѺ�����٥�Ȱk���r��1���g�Υ��󥿩`�Х���O������褦�˘����
// 1.1.1 2015/12/10 �ԥ��������ȥ��˥ޥ������`�Щ`����ȥ���`�ˤʤ�F�������
// 1.1.0 2015/11/23 ����󥤥٥�Ȥ���ӳ���������Υԥ����㷬�Ť��ض�����C�ܤ�׷��
//                  �O����͸��ɫ�򿼑]����C�ܤ�׷��
//                  �ȥꥬ�`�Ȥ��ơ��ҥ���å����䡸�LѺ������׷��
// 1.0.0 2015/11/14 ����
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc �ԥ�����Υܥ��󻯥ץ饰����
 * @author �ȥꥢ���󥿥�
 *
 * @param ͸��ɫ�򿼑]
 * @desc ����å����줿�w����͸��ɫ���ä����Ϥϡ�����å���o���ˤ��롣
 * @default OFF
 *
 * @param �ԥ����㷬�ŤΉ�������
 * @desc ����󥤥٥�Ⱥ��ӳ����r�˥ԥ����㷬�Ť��{���륲�`�������η��š�
 * @default 0
 *
 * @help �ԥ�����򥯥�å�����ȡ�ָ����������󥤥٥�Ȥ�
 * ���ӳ������褦�ˤʤ�ץ饰���󥳥ޥ�ɤ��ṩ���ޤ���
 * ���Υץ饰��������ä���С�javascript��֪�R���ʤ��Ƥ�
 * �l�Ǥ⺆�g�˥���å��䥿�å�������ˤ������`�������ޤ���
 *
 * ע�⣡
 * һ���v�B�Ť����ԥ�����ȥ���󥤥٥�Ȥϥԥ��������ȥ���Ƥ��Є��Ǥ���
 * �ԥ����㤬���ڤ��ʤ���Фɤ��򥯥�å����Ƥⷴ�ꤷ�ޤ��󤬡�
 * ͬ�����Ť��ٶȡ��ԥ�����α�ʾ���Ф��ȷ��ꤹ��褦�ˤʤ�ޤ���
 *
 * �ץ饰���󥳥ޥ��Ԕ��
 *  ���٥�ȥ��ޥ�ɡ��ץ饰���󥳥ޥ�ɡ�����g�С�
 *  ���������g�ϰ�ǥ��ک`�������Ф룩
 *
 *  P_CALL_CE [�ԥ����㷬��] [����󥤥٥��ID] [�ȥꥬ�`]:
 *      �ԥ����㤬����å����줿�Ȥ��˺��ӳ�����륳��󥤥٥�Ȥ��v�B  �Ť��ޤ���
 *  �����ȥꥬ�`�����¤�ͨ��Ǥ���(ʡ�Ԥ���� 1 �ˤʤ�ޤ�) 
 *   P_CALL_CE [�DƬID] [�����¼�ID] [ģʽ]
 *       ����P_CALL_CE 1 1 1
 *  ����1 : ����å���������   ռ�ĈDƬ
 *      2 : �ҥ���å��������� ���Iռ�ĈDƬ
 *      3 : �LѺ����������     ͼƬ����
 *      4 : �ޥ������ؤͤ����� �����ͼƬ��
 *      5 : �ޥ�����Ť������� ����뿪ͼƬ
 *
 *  P_CALL_CE_REMOVE [�ԥ����㷬��] :
 *      �ԥ�����ȥ���󥤥٥�Ȥ��v�B�Ť��������ޤ���
 *      ȫ�ƤΥȥꥬ�`����������Ǥ���
 *
 * ����Ҏ�s��
 *  ���ߤ˟o�ϤǸĉ䡢���䲼�����ܤǡ������ΑB�����á�18�����õȣ�
 *  �ˤĤ��Ƥ����ޤϤ���ޤ���
 *  ���Υץ饰����Ϥ⤦���ʤ��Τ�ΤǤ���
 */
/*:
 * @plugindesc Clickable picture plugin
 * @author triacontane
 *
 * @param TransparentConsideration
 * @desc if click position is transparent, click is disabled.
 * @default OFF
 *
 * @param GameVariablePictureNum
 * @desc Game variable number that stores the picture number when common event called.
 * @default 0
 * 
 * @help When clicked picture, call common event.
 *
 * Plugin Command
 *
 *  P_CALL_CE [Picture number] [Common event ID] [Trigger]:
 *      When picture was clicked, assign common event id.
 *  ����Trigger are As below(if omit, It is specified to 1)
 *  ����1 : Left click
 *      2 : Right click
 *      3 : Long click
 *      4 : Mouse over
 *      5 : Mouse out
 *
 *  P_CALL_CE_REMOVE [Picture number] :
 *      break relation from picture to common event.
 *
 *  This plugin is released under the MIT License.
 */
(function () {
    var pluginName = 'PictureCallCommon';

    //=============================================================================
    // PluginManager
    //  �����Z��null�ˌ��ꤷ���ѥ��`����ȡ�ä��Ф��ޤ���
    //  ���Υ��`�ɤ��Ԅ����ɤ��졢ȫ�ƤΥץ饰�����ͬ����Τ�ʹ�ä���ޤ���
    //=============================================================================
    PluginManager.getParamBoolean = function(pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return (value || '').toUpperCase() == 'ON';
    };

    PluginManager.getParamOther = function(pluginName, paramEngName, paramJpgName) {
        var value = this.parameters(pluginName)[paramEngName];
        if (value == null) value = this.parameters(pluginName)[paramJpgName];
        return value;
    };

    PluginManager.getParamNumber = function (pluginName, paramEngName, paramJpgName, min, max) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        if (arguments.length <= 3) min = -Infinity;
        if (arguments.length <= 4) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    PluginManager.getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    PluginManager.checkCommandName = function(command, value) {
        return this.getCommandName(command) === value;
    };

    PluginManager.getArgString = function (index, args) {
        return this.convertEscapeCharacters(args[index]);
    };

    PluginManager.getArgNumber = function (index, args, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(this.convertEscapeCharacters(args[index]), 10) || 0).clamp(min, max);
    };

    PluginManager.convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    PluginManager.actorName = function(n) {
        var actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : '';
    };

    PluginManager.partyMemberName = function(n) {
        var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : '';
    };

    //=============================================================================
    // Game_Interpreter
    //  �ץ饰���󥳥ޥ��[P_CALL_CE]�ʤɤ�׷�Ӷ��x���ޤ���
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        var pictureId;
        var commonId;
        var trigger;
        switch (PluginManager.getCommandName(command)) {
            case 'P_CALL_CE' :
                pictureId = PluginManager.getArgNumber(0, args, 1, 100);
                commonId  = PluginManager.getArgNumber(1, args, 1, 100);
                trigger   = PluginManager.getArgNumber(2, args, 1, 8);
                $gameScreen.setPictureCallCommon(pictureId, commonId, trigger);
                break;
            case 'P_CALL_CE_REMOVE' :
                pictureId = PluginManager.getArgNumber(0, args, 1, 100);
                $gameScreen.setPictureRemoveCommon(pictureId);
                break;
        }
    };

    //=============================================================================
    // Game_Temp
    //  ���ӳ����趨�Υ���󥤥٥��ID�Υե��`��ɤ�׷�Ӷ��x���ޤ���
    //=============================================================================
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._pictureCommonId = 0;
        this._pictureNum = 0;
    };

    //=============================================================================
    // Game_Map
    //  �ԥ����㤬���å����줿�Ȥ��Υ���󥤥٥�Ⱥ��ӳ����I���׷�Ӷ��x���ޤ���
    //=============================================================================
    var _Game_Map_setupStartingEvent = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function() {
        var result = _Game_Map_setupStartingEvent.call(this);
        return result || this.setupPictureCommonEvent();
    };

    Game_Map.prototype.setupPictureCommonEvent = function() {
        var commonId = $gameTemp._pictureCommonId;
        var event    = $dataCommonEvents[commonId];
        var result   = false;
        if (commonId > 0 && !this.isEventRunning() && event) {
            var gameValueNum = PluginManager.getParamNumber(pluginName,
                'GameVariablePictureNum', '�ԥ����㷬�ŤΉ�������', 0, 5000);
            if (gameValueNum !== 0) $gameVariables.setValue(gameValueNum, $gameTemp._pictureNum);
            this._interpreter.setup(event.list);
            result = true;
        }
        $gameTemp._pictureCommonId = 0;
        $gameTemp._pictureNum = 0;
        return result;
    };

    //=============================================================================
    // Game_Troop
    //  �ԥ����㤬���å����줿�Ȥ��Υ���󥤥٥�Ⱥ��ӳ����I���׷�Ӷ��x���ޤ���
    //=============================================================================
    Game_Troop.prototype.setupPictureCommonEvent = function() {
        var commonId = $gameTemp._pictureCommonId;
        var event = $dataCommonEvents[commonId];
        if (commonId > 0 && !this.isEventRunning() && event) {
            var gameValueNum = PluginManager.getParamNumber(pluginName,
                'GameVariablePictureNum', '�ԥ����㷬�ŤΉ�������', 0, 5000);
            if (gameValueNum !== 0) $gameVariables.setValue(gameValueNum, $gameTemp._pictureNum);
            this._interpreter.setup(event.list);
        }
        $gameTemp._pictureCommonId = 0;
        $gameTemp._pictureNum = 0;
    };

    //=============================================================================
    // Game_Screen
    //  �ԥ�����ˌ��ꤹ�륳��󥤥٥�Ⱥ��ӳ����ä�ID���Ф�׷�Ӷ��x���ޤ���
    //=============================================================================
    var _Game_Screen_initialize = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function() {
        _Game_Screen_initialize.call(this);
        this._pictureCidArray = [];
    };

    Game_Screen.prototype.setPictureCallCommon = function(pictureId, commonId, trigger) {
        var realPictureId = this.realPictureId(pictureId);
        if (this._pictureCidArray[realPictureId] == null) this._pictureCidArray[realPictureId] = [];
        this._pictureCidArray[realPictureId][trigger] = commonId;
    };

    Game_Screen.prototype.setPictureRemoveCommon = function(pictureId) {
        var realPictureId = this.realPictureId(pictureId);
        this._pictureCidArray[realPictureId] = [];
    };

    //=============================================================================
    // Scene_Map
    //  �ԥ�����Υ��å�״�B����Υ���󥤥٥�Ⱥ��ӳ�����s��׷�Ӷ��x���ޤ���
    //=============================================================================
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if (!$gameMap.isEventRunning()) this.updateTouchPictures();
        _Scene_Map_update.call(this);
    };

    Scene_Map.prototype.updateTouchPictures = function() {
        this._spriteset.callTouchPictures();
    };

    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        return _Scene_Map_isMapTouchOk.call(this) && $gameTemp._pictureCommonId === 0;
    };

    //=============================================================================
    // Scene_Battle
    //  �ԥ�����Υ��å�״�B����Υ���󥤥٥�Ⱥ��ӳ�����s��׷�Ӷ��x���ޤ���
    //=============================================================================
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        this.updateTouchPictures();
        $gameTroop.setupPictureCommonEvent();
        _Scene_Battle_update.call(this);
    };

    Scene_Battle.prototype.updateTouchPictures = function() {
        this._spriteset.callTouchPictures();
    };

    //=============================================================================
    // Spriteset_Base
    //  �ԥ�����Υ��å�״�B����Υ���󥤥٥�Ⱥ��ӳ�����s��׷�Ӷ��x���ޤ���
    //=============================================================================
    Spriteset_Base.prototype.callTouchPictures = function() {
        this._pictureContainer.children.forEach(function(picture) {
            picture.callTouch();
        }, this);
    };

    //=============================================================================
    // Sprite_Picture
    //  �ԥ�����Υ��å�״�B����Υ���󥤥٥�Ⱥ��ӳ�����s��׷�Ӷ��x���ޤ���
    //=============================================================================
    var _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._triggerHandler    = [];
        this._triggerHandler[1]        = this.isTriggered;
        this._triggerHandler[2]        = this.isCancelled;
        this._triggerHandler[3]        = this.isLongPressed;
        this._triggerHandler[4]        = this.isOnFocus;
        this._triggerHandler[5]        = this.isOutFocus;
        this._triggerHandler[6]        = this.isReleased;
        this._triggerHandler[7]        = this.isRepeated;
        this._triggerHandler[8]        = this.isPressed;
        this._onMouse                  = false;
        this._outMouse                 = false;
        this._wasOnMouse               = false;
        this._transparentConsideration =
            PluginManager.getParamBoolean(pluginName, 'TransparentConsideration', '͸��ɫ�򿼑]');
    };

    var _Sprite_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_update.call(this);
        this._onMouse  = false;
        this._outMouse = false;
        var commandIds = $gameScreen._pictureCidArray[$gameScreen.realPictureId(this._pictureId)];
        if (commandIds == null || (commandIds[4] == null && commandIds[5] == null)) return;
        if (TouchInput.isMoved()) {
            if (this.isTouchable() && this.isTouchPosInRect() && !this.isTransparent()) {
                if (!this._wasOnMouse) {
                    this._onMouse    = true;
                    this._wasOnMouse = true;
                }
            } else {
                if (this._wasOnMouse) {
                    this._outMouse   = true;
                    this._wasOnMouse = false;
                }
            }
        }
    };

    Sprite_Picture.prototype.callTouch = function() {
        var commandIds = $gameScreen._pictureCidArray[$gameScreen.realPictureId(this._pictureId)];
        if (commandIds == null) return;
        for (var i = 1; i <= this._triggerHandler.length; i++) {
            if (commandIds[i] != null && this._triggerHandler[i].call(this) && (i === 5 || i === 4 || !this.isTransparent())) {
                if (i === 3) TouchInput._pressedTime = -60;
                $gameTemp._pictureCommonId = commandIds[i];
                $gameTemp._pictureNum = this._pictureId;
            }
        }
    };

    Sprite_Picture.prototype.isTransparent = function () {
        if (!this._transparentConsideration) return false;
        var bx = (TouchInput.x - this.x) / this.scale.x + this.anchor.x * this.width;
        var by = (TouchInput.y - this.y) / this.scale.y + this.anchor.y * this.height;
        return this.bitmap.getAlphaPixel(bx, by) === 0;
    };

    Sprite_Picture.prototype.screenWidth = function() {
        return (this.width || 0) * this.scale.x;
    };

    Sprite_Picture.prototype.screenHeight = function() {
        return (this.height || 0) * this.scale.y;
    };

    Sprite_Picture.prototype.screenX = function() {
        return (this.x || 0) - this.anchor.x * this.screenWidth();
    };

    Sprite_Picture.prototype.screenY = function() {
        return (this.y || 0) - this.anchor.y * this.screenHeight();
    };

    Sprite_Picture.prototype.minX = function() {
        var width = this.screenWidth();
        return Math.min(this.screenX(), this.screenX() + width);
    };

    Sprite_Picture.prototype.minY = function() {
        var height = this.screenHeight();
        return Math.min(this.screenY(), this.screenY() + height);
    };

    Sprite_Picture.prototype.maxX = function() {
        var width = this.screenWidth();
        return Math.max(this.screenX(), this.screenX() + width);
    };

    Sprite_Picture.prototype.maxY = function() {
        var height = this.screenHeight();
        return Math.max(this.screenY(), this.screenY() + height);
    };

    Sprite_Picture.prototype.isTouchPosInRect = function () {
        var tx = TouchInput.x;
        var ty = TouchInput.y;
        return (tx >= this.minX() && tx <= this.maxX() &&
                ty >= this.minY() && ty <= this.maxY());
    };

    Sprite_Picture.prototype.isTouchable = function() {
        return this.bitmap != null && this.visible && this.scale.x !== 0 && this.scale.y !== 0;
    };

    Sprite_Picture.prototype.isTriggered = function() {
        return this.isTouchEvent(TouchInput.isTriggered);
    };

    Sprite_Picture.prototype.isCancelled = function() {
        return this.isTouchEvent(TouchInput.isCancelled);
    };

    Sprite_Picture.prototype.isLongPressed = function() {
        return this.isTouchEvent(TouchInput.isLongPressed);
    };

    Sprite_Picture.prototype.isPressed = function() {
        return this.isTouchEvent(TouchInput.isPressed);
    };

    Sprite_Picture.prototype.isReleased = function() {
        return this.isTouchEvent(TouchInput.isReleased);
    };

    Sprite_Picture.prototype.isRepeated = function() {
        return this.isTouchEvent(TouchInput.isRepeated);
    };

    Sprite_Picture.prototype.isOnFocus = function() {
        return this._onMouse;
    };

    Sprite_Picture.prototype.isOutFocus = function() {
        return this._outMouse;
    };

    Sprite_Picture.prototype.isTouchEvent = function(triggerFunc) {
        return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
    };

    //=============================================================================
    // TouchInput
    //  �ݥ����Ƅӕr�˥ޥ���λ�ä�ӛ�h�򳣤��Ф��褦��Ԫ�΄I����ϕ���
    //=============================================================================
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    }
})();