//=============================================================================
// 2w_message.js
//=============================================================================

/*:
 * @plugindesc 显示文本加强
 * @author 汪汪
 * 
 * @help 
 *  
 * \. \|  : 扩展  \.[z] 和 \|[z] 方法  等待z
 * \{ \}  : 扩展  支持\{[z]  \}[z] 增加减少字号  \{}[z] 设置字号
 * \C : 扩展 支持 \C[#FFFF00]
 * \Y : 一个新页  支持 \Y 和 \Y[n] 设置位置 ,
 *       会重置图片,间隔时间,字体,脸图等
 *       n为 3 4 5 6 7 8 时 有多个参数  \Y[n id xc yc ixc iyc xd yd]
 *       3 时id  跟随者序号 操作的本人为 0  
 *       4 时id  事件的编号 没有时优先选择本事件,然后没有本事件时选择操作者 
 *       5 时id  队伍成员编号 
 *       6 时id  角色编号 
 *       7 时id  敌群中敌人序号 
 *       8 时id  为屏幕位置种类 ( 0 时 [0,0,1,1] 1时 [0,0,屏幕,屏幕] )
 * 
 *       窗口显示位置 为   
 *       选择的图片为 cx,cy,cw,ch 
 *       本窗口为 ix,iy,iw,ih
 *       x =  cx + xc * cw - ixc * iw  + xd     
 *       y =  cy + yc * ch - iyc * ih  + yd     
 *       简单来说 yc xc 为0 为 目标图片的左(上)端 0.5为中间, 1 为右(下)端
 *       ixc iyc 相当于本窗口的锚点 0 为 本窗口的左(上)端 0.5为中间, 1 为右(下)端
 *       最后结果是  本窗口锚点与目标点重合 
 *       然后 xd yd 为相对移动的距离
 *       未设置时  yc,xc ixc,iyc 的默认值为 0.5 , yd xd 为 0 
 *       也就是 窗口的中间 会和 目标的中间  对齐 
 *       
 *       位置为靠近边缘时可自动调整但不能保证效果
 * \WH[w h] :设置当前绘制页的大小
 * \T[n name index] :
 *    在message 下显示name的图片, index为编号,当不设置时为0,同一编号图片会相互替代 
 *    n 位置: 锚点 图片的 123456789顶点 坐标 message的 123456789顶点
 *            当 小于10 时 锚点 坐标 都为 n   比如 1 ,  图片以左下角正对信息框的左下角 
 *            当 大于10 时 前面为 锚点 后面为坐标  如 12 表示 以左下顶点为锚点 坐标为 message的下顶点 
 * \S[n] :设置每个字符之间间隔的时间,换页重置
 * \F[n name index] :
 *      在message 下显示name index的脸图, n位置 1 左 2 右
 * \=  \=[z] 
 *     设置粗体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 * \/  \/[z] 
 *     设置斜体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 *  
 * \NY   
 *     添加一个和上页相同设置的新页 
 * \OC[color]
 *     设置外围线条颜色 
 * \OW[number]
 *     设置外围线条粗细 
 * 
 * \WT[z] 
 *     设置本页的横向排列位置 , 不填为 0左对齐,   1 中间,2右对齐
 * \HT[z] 
 *     设置本页纵向排列位置 , 不填为 0 上对齐,  1 中间,2 下对齐
 * 
 * \AW[z] 
 *     设置本页是否根据内容调整宽, 不填为 0  不调整 1 调整
 * \AH[z] 
 *     设置本页是否根据内容调整高, 不填为 0  不调整 1 调整
 * 
 * \WH[wnum hnum] 
 *     强行设置本页大小 (不推荐使用ing)
 *  
 * \TWH[wnum hnum] 
 *     添加一个wh的文字
 * 
 *  
 * \WJ  \WJ[z] 
 *     设置横字间隔 , 不填为 0
 * \HJ  \HJ[z] 
 *     设置纵行间隔 , 不填为 0
 * 
 * 
 * 脸图现在是编号为 -1 左  -2 右 的图片  
 * 之前\T 调用的图片为 编号为 0 的图片  
 * 
 * 支持多个图片同时显示,移动,消失,旋转 
 * 并且可以控制图片的z值 实现相互遮盖 高度大的遮盖小的,相同时后的遮盖前的
 * 窗口的z值为0
 *  
 *  以下需要在 [[ ]] 中输入参数 , 字符串的参数需要加 "" 其中参数有连续 ]] 的 这样的请用 ] ]
 *  \BS[[visible]]   背景的显示  visible 为 true或false ,
 *  \PS[[pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode]]   显示图片
 *  \PM[[pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration]]  移动图片
 *  \PR[[pictureId, speed]] 旋转图片(速度)
 *  \PRT[[pictureId, rotation, duration]] 旋转图片到(角度)  ///这个还不支持
 *  \PT[[pictureId, tone, duration]]  设置色调
 *  \PE[[pictureId]]  消除图片
 *  \PEA[[pictureId]]  全部清除图片
 *  \PES[[pictureId]]  避免一次清除图片
 *  \PZ[[pictureId,zindex]] 设置图片z值高度  <0 为在窗口下面 
 *  \FF[[z]] 设置字体名称  z为字符串 如: "黑体"
 *  \FS[[z]] 设置字体字号  z为数值
 *  \FC[[z]] 设置字体颜色  z为字符串 如: "#ffffff"
 *  \FB[[z]] 修改字体粗体  z为 true 或 false
 *  \FI[[z]] 修改字体斜体  z为 true 或 false
 *  \FR[[z]] 重设字体到默认
 *  \FFR[[z]] 设置字体名称到默认
 *  \FSR[[z]] 设置字体字号到默认
 *  \FCR[[z]] 设置字体颜色到默认
 *  
 * 
 * 
 */



Window_Base.deepCopy = function (that) {
    var obj
    if (typeof (that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) { //Object.prototype.toString.call(that) === '[object Array]') { 
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj[i] = this.deepCopy(that[i]);
            }
        } else {
            obj = {}
            for (var i in that) {
                obj[i] = this.deepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};



Bitmap._window = null
Bitmap.prototype.window = function () {
    if (!Bitmap._window) {
        Bitmap._window = new Window_Base()
    }
    Bitmap._window.contents = this
    return Bitmap._window
}




Bitmap.prototype._makeFontNameText = function () {
    return (this.fontBold ? "Bold " : '') + (this.fontItalic ? 'Italic ' : '') +
        this.fontSize + 'px ' + this.fontFace;
};


Window_Base.prototype.standardFontBold = function () {
    return false
};

/** */
Window_Base.prototype.standardFontItalic = function () {
    return false
};

/**字体设置 */
Window_Base.prototype.fontSettings = function (i) {
    if (i || !this.contents._fontnametext) {
        this.contents._fontnametext = this.contents._makeFontNameText()
    }
    return this.contents._fontnametext
};


Window_Base.prototype.standardTextColor = function () {
    return '#ffffff';
};

Window_Base.prototype.standardFontSize = function () {
    return 20;
};

/**文本高 */
Window_Base.prototype.standardOutlineColor = function () {

    return 'rgba(0, 0, 0, 0.5)';
};
Window_Base.prototype.standardOutlineWidth = function () {

    return 4;
};


Window_Base.prototype.standardBS = function () {
    return true;
};

/**还原 */
Window_Base.prototype.resetFontSettings = function () {
    this.contents.textColor = this.standardTextColor()
    this.contents.fontItalic = this.standardFontItalic()
    this.contents.fontBold = this.standardFontBold()
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.contents.outlineColor = this.standardOutlineColor();
    this.contents.outlineWidth = this.standardOutlineWidth();

    this._windowSpriteContainer.visible = this.standardBS()

    this.fontSettings(1)
    this.resetTextColor();
    this.reHjg()
    this.reWjg()
    this.rejiange()
};

Window_Base.prototype.saveFontSettings = function (bitmap) {
    if (bitmap) {
        var fontSet = {
            textColor: bitmap.textColor,
            fontItalic: bitmap.fontItalic,
            fontBold: bitmap.fontBold,
            fontFace: bitmap.fontFace,
            fontSize: bitmap.fontSize,
            outlineColor: bitmap.outlineColor,
            outlineWidth: bitmap.outlineWidth
        }

    } else {
        var fontSet = {
            textColor: this.standardTextColor(),
            fontItalic: this.standardFontItalic(),
            fontBold: this.standardFontBold(),
            fontFace: this.standardFontFace(),
            fontSize: this.standardFontSize(),
            outlineColor: this.standardOutlineColor(),
            outlineWidth: this.standardOutlineWidth(),
        }
    }
    return fontSet
}


Window_Base.prototype.loadFontSettings = function (bitmap, fontSet) {
    if (fontSet && bitmap) {
        //console.log("load",fontSet)
        bitmap.textColor = fontSet.textColor
        bitmap.fontItalic = fontSet.fontItalic
        bitmap.fontBold = fontSet.fontBold
        bitmap.fontFace = fontSet.fontFace
        bitmap.fontSize = fontSet.fontSize
        bitmap.outlineColor = fontSet.outlineColor
        bitmap.outlineWidth = fontSet.outlineWidth
    }

}




/**文本高 */
Window_Base.prototype.calcTextHeight = function () {
    var maxFontSize = this.contents.fontSize;
    var textHeight = maxFontSize + 8;
    return textHeight;
};


Window_Base.prototype.makePage = function (textState) {
    var page = {
        "type": "page",
        "set": {},
        "list": [],
        "test": { "x": 0, "y": 0, "w": 0, "h": 0 }
    }

    page.set = Window_Base.deepCopy(textState.pageset)
    return page
};
Window_Base.prototype.makeLine = function (textState) {
    return { "type": "line", "list": [], "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Window_Base.prototype.makeText = function (textState) {
    return { "type": "text", "text": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Window_Base.prototype.makeIcon = function (textState) {
    return { "type": "icon", "icon": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Window_Base.prototype.makeLCFText = function (textState) {
    return { "type": "lcf", "lcf": "", "lcfwh": { "w": 0, "h": 0 }, "list": [] }
};
/**测试文字增强 */
Window_Base.prototype.testTextEx = function (text, x, y, w, h, wt, ht, facepos, wz, aw, ah) {
    var text = text || ""
    var draw = { x: x || 0, y: y || 0 }
    var pageset = {
        w: w || Infinity,
        h: h || Infinity,
        wtype: wt,
        htype: ht,
        autow: aw,
        autoh: ah,
        facepos: facepos || 0,
        wz: wz || 0,
        draw: draw
    }
    var t = this.convertEscapeCharacters(text)
    var textState = {
        text: t,
        textindex: 0,
        tsl: [],
        textf: {},
        index: 0,
        pages: [],
        list: [],
        pageset: pageset,
    };

    this.resetFontSettings();

    this.tslPushAll(textState)

    this.testMakePages(textState)

    this.testMakeList(textState)

    this.resetFontSettings();
    return textState;
};


/**设置绘制xy */
Window_Base.prototype.setDrawxy = function (textState, draw) {
    if (textState && draw) {
        textState.draw = draw
        return textState;
    } else {
        return null;
    }
};

/**设置页设置 */
Window_Base.prototype.setTextPageset = function (textState, pageset) {
    if (textState && pageset) {
        textState.pageset = pageset
        return textState;
    } else {
        return null;
    }
};


/**制作页 */
Window_Base.prototype.testMakePages = function (textState) {
    if (textState) {
        var list = textState.tsl || []
        textState.pages = []
        for (var i = 0; i < list.length; i++) {
            var obj = list[i]
            var type = obj.type
            if (type == "page") {
                var page = this.makePage(textState)
                page.set = obj.set
                this.testPushPage(textState, page)
                //重设间隔 
                this.rejg()
            } else if (type == "line") {
                var line = this.makeLine()
                this.testPushLine(textState, line)
            } else if (type == "icon") {
                this.testPushText(textState, obj)
            } else if (type == "text") {
                this.testPushText(textState, obj)
            } else if (type == "lcf") {
                this.testPushLCFText(textState, obj)
            } else if (type == "wjg") {
                this.setWjg(obj.value)
            } else if (type == "hjg") {
                this.setHjg(obj.value)
            } else {
                this.testPushOther(textState, obj)
            }
        }
        this.testPushEnd(textState)
        return textState
    } else {
        return null
    }
};


/**测试列表 */
Window_Base.prototype.testMakeList = function (textState) {
    if (textState && textState.pages) {
        textState.list = []
        for (var pi = 0; pi < textState.pages.length; pi++) {
            var p = textState.pages[pi]
            textState.list.push(p)
            if (p && p.list) {
                for (var li = 0; li < p.list.length; li++) {
                    var l = p.list[li]
                    textState.list.push(l)
                    if (l && l.list) {
                        for (var ci = 0; ci < l.list.length; ci++) {
                            var c = l.list[ci]
                            if (c) {
                                textState.list.push(c)
                            }
                        }
                    }
                }
            }
        }
        return textState
    } else {
        return null
    }
};


Window_Base.prototype.indexCharacter = function (textState, index) {
    return textState.list[index];
};

Window_Base.prototype.needsCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index)
};


Window_Base.prototype.nextCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index + 1)
};


/** */
Window_Base.prototype.drawTextEx = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, p, l);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.w;
    } else {
        return 0;
    }
};



/**绘制 */
Window_Base.prototype.drawTextEx2 = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, p, l);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.h;
    } else {
        return 0;
    }
};

/**添加所有 */
Window_Base.prototype.tslPushAll = function (textState) {
    this.tslPushHear(textState)
    while (textState.textindex < textState.text.length) {
        this.tslPushCharacter(textState);
    }
    this.tslPushEnd(textState)
};

/**测试添加头 */
Window_Base.prototype.tslPushHear = function (textState) {
    textState.textindex = 0
    if (textState.text[0] == '\x1b') {
        if (this.tslPushEscapeCode(textState) == "Y") {
            this.tslPushNewPageY(textState)
            return
        }
    }
    if (!textState.page) {
        this.tslPushPage(textState)
        this.tslPushLine(textState)
    }
    textState.textindex = 0
};

/**测试 添加尾 */
Window_Base.prototype.tslPushEnd = function (textState) {
    textState.textindex = 0
    delete textState.page
    delete textState.line
};


/**添加其他 */
Window_Base.prototype.tslPush = function (textState, obj) {
    textState.tsl.push(obj)
};


/**测试添加页 */
Window_Base.prototype.tslPushPage = function (textState, page) {
    var page = page || this.makePage(textState)
    textState.page = page
    this.tslPush(textState, page)
};


/**测试添加行 */
Window_Base.prototype.tslPushLine = function (textState, line) {
    var line = line || this.makeLine()
    var page = textState.page
    textState.line = line
    this.tslPush(textState, line)
};


/**页设置脸图 */
Window_Base.prototype.tslPushPic = function (textState, pic) {
    if (pic) {
        //ImageManager.loadPicture(pic.name)
        var page = textState.page
        page.set.ps = page.set.ps || {}
        page.set.ps[pic.index] = pic.name
        this.tslPush(textState, pic)
    }
}



/**页设置脸图 */
Window_Base.prototype.tslPushFace = function (textState, face) {
    if (face) {
        ImageManager.loadFace(face.name)
        if (face.pos == 1 || face.pos == 0) {
            var pid = -1
        } else {
            var pid = -2
        }

        page.set.ps = page.set.ps || {}
        page.set.ps[pid] = face.name
        this.tslPush(textState, face)
    }
}


/**添加字符 */
Window_Base.prototype.tslPushOther = function (textState, text) {
    if (text) {
        this.tslPush(textState, text)
    }
};
//****************************************************************** */

/**测试添加页 */
Window_Base.prototype.testPushPage = function (textState, page) {
    /**处理上一个页 */
    this.testPushLine(textState, 0, 1)
    var page = page || this.makePage(textState)
    textState.page = page
    textState.pages.push(page)
    textState.line = null
};


/**测试添加行 */
Window_Base.prototype.testPushLine = function (textState, line, cs) {
    var line = line || this.makeLine()
    var page = textState.page
    var line0 = textState.line
    /**有页时 */
    if (page) {
        /**有上一行时 */
        if (line0) {
            var ph = page.test.h
            var lh = line0.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0

            line0.test.y = page.test.h + jh
            page.test.h = line0.test.h + line0.test.y

            page.test.w = Math.max(page.test.w, line0.test.w)
            var must = page.set
            var fw = Window_Base._faceWidth + 24
            var w = must.w - (page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0)
            var h = must.h
            /**处理宽 */
            if (w != Infinity) {
                if (line0.test.w < w) {
                    if (must.wtype === 1) {
                        /**中心对齐 */
                        line0.test.x = (w - line0.test.w) / 2
                    } else if (must.wtype === 2) {
                        /**右对齐 */
                        line0.test.x = (w - line0.test.w)
                    }
                } else {
                    /**左对齐 */
                    line0.test.x = 0
                }
            }
            /**处理高 */
            if (h != Infinity) {
                if (page.test.h < h) {
                    if (must.htype == 1 || page.set.htype === 1) {
                        page.test.y = (h - page.test.h) / 2
                    } else if (must.htype == 2) {
                        page.test.y = (h - page.test.h)
                    }
                } else {
                    page.test.y = 0
                }
            }
            page.list.push(line0)
        }
    }
    if (cs) { return }
    textState.line = line
};


Window_Base.prototype.testPushLCFText = function (textState, lcftext) {
    var lcftext = lcftext || this.makeLCFText()
 
    var list = lcftext.list

    if (!list.length) {
        return
    }
 

    var lcf = lcftext.lcf

    var lcfwh = lcftext.lcfwh
    var lcfw = lcfwh.w


    var line = textState.line
    var page = textState.page
    var pageset = page.set

    //====处理字====
    var lw = line.test.w
    var tw = text.test.w
    //宽间隔
    var jw = (lw == 0 || tw == 0) ? 0 : this.getWjg() || 0
    var sw = pageset.w
    var fw = Window_Base._faceWidth + 24
    var fw = page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0


    var syw = sw - fw - lw - jw

    var rel = []
    var rei = -1
    var odw = 0
    var rel2 = []
    for (var i = 0; i < list.length; i++) {
        var re = list[i]
        odw += re.w
        if (odw + ((i == list.length - 1) ? 0 : lcfw) <= syw) {
            rei = i
        }
    }

    //如果第一个都放不下
    if (rei == -1) {
        //如果是开头
        if (lw == 0) {
            var text = this.makeText()
            text.text = re[0].text
            text.test.w = re[0].w
            text.test.h = re[0].h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushOther(textState, text)

            //====处理行====
            var ph = page.test.h
            var lh = line.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
            var sh = pageset.h
            //行能放到页中 
            if (ph + jh + lh <= sh || ph == 0) {
                //不能放到页中 或者 不是第一行
            } else {
                //添加新页
                textState.line = null
                var page2 = this.makePage(textState)
                page2.type = "addpage"
                page2.set = Window_Base.deepCopy(page.set)
                this.testPushPage(textState, page2)
                //行添加到新页
                this.testPushLine(textState, line)
            }
            rei = 0
        } else {
            //添加新行
            var line2 = this.makeLine()
            line2.type = "addline"
            line2.set = line.set
            this.testPushLine(textState, line2)
        }
    } else {
        for (var i = 0; i <= rei; i++) {
            var text = this.makeText()
            text.text = re[i].text
            text.test.w = re[i].w
            text.test.h = re[i].h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushOther(textState, text)

        }
        //如果不是到达最后一个
        if (rei < list.length - 1) {
            var text = this.makeText()
            text.text = lcftext.lcf
            text.test.w = lcftext.lcfwh.w
            text.test.h = lcftext.lcfwh.h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushOther(textState, text) 
        } 
        //====处理行====
        var ph = page.test.h
        var lh = line.test.h
        //间隔
        var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
        var sh = pageset.h
        //行能放到页中 
        if (ph + jh + lh <= sh || ph == 0) {
            //不能放到页中 或者 不是第一行
        } else {
            //添加新页
            textState.line = null
            var page2 = this.makePage(textState)
            page2.type = "addpage"
            page2.set = Window_Base.deepCopy(page.set)
            this.testPushPage(textState, page2)
            //行添加到新页
            this.testPushLine(textState, line)
        } 
    }

    
    var lclist2 = []
    for(var i= rei+1;i<list.length;i++){
        lclist2.push(list[i])
    }
    if(lclist2.length){
        var lcftext2 = this.makeLCFText()
        lcftext2.lcf = lcf 
        lcftext2.lcfwh = lcfwh 
        lcftext2.list = lclist2 
        //处理下一个
        this.testPushLCFText(textState,lcftext2)  
    }
};

/**添加字符 */
Window_Base.prototype.testPushText = function (textState, text) {
    var text = text || this.makeText()
    var line = textState.line
    var page = textState.page
    var pageset = page.set

    //====处理字====
    var lw = line.test.w
    var tw = text.test.w
    //宽间隔
    var jw = (lw == 0 || tw == 0) ? 0 : this.getWjg() || 0
    var sw = pageset.w
    var fw = Window_Base._faceWidth + 24
    var fw = page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0
    //行可以放开字  或者 第一个
    if (lw + jw + tw <= sw - fw || lw == 0) {
        //添加字符 
        text.test.x = lw + jw
        line.test.w = text.test.x + tw
        line.test.h = Math.max(line.test.h, text.test.h)
        this.testPushOther(textState, text)

        //====处理行====
        var ph = page.test.h
        var lh = line.test.h
        //间隔
        var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
        var sh = pageset.h
        //行能放到页中 
        if (ph + jh + lh <= sh || ph == 0) {
            //不能放到页中 或者 不是第一行
        } else {
            //添加新页
            textState.line = null
            var page2 = this.makePage(textState)
            page2.type = "addpage"
            page2.set = Window_Base.deepCopy(page.set)
            this.testPushPage(textState, page2)
            //行添加到新页
            this.testPushLine(textState, line)

        }
    }
    //行放不开
    else {
        /**单个空格的话不添加到新行 */
        if (text.ge && text.text == " ") {
            //添加新行
            var line2 = this.makeLine()
            line2.type = "addline"
            line2.set = line.set
            this.testPushLine(textState, line2)
            return
        }

        //添加新行
        var line2 = this.makeLine()
        line2.type = "addline"
        line2.set = line.set
        this.testPushLine(textState, line2)
        this.testPushText(textState, text)
    }
};

/**添加其他 */
Window_Base.prototype.testPushOther = function (textState, obj) {
    textState.line.list.push(obj)
};

/**添加结束 */
Window_Base.prototype.testPushEnd = function (textState) {
    this.testPushLine(textState, 0, 1)
};

/***************************************************************************** */


//处理字符
Window_Base.prototype.tslPushCharacter = function (textState) {
    //检查 文本状态 文本[文本状态 索引]
    switch (textState.text[textState.textindex]) {
        //当 "\n"
        case '\n':
            //处理新行( 文本状态 )
            this.tslPushNewLine(textState);
            break;
        case '\f':
            this.tslPushNewPage(textState);
            break;
        case '\x1b':
            this.tslPushEscapeCharacter(textState, this.tslPushEscapeCode(textState));
            break;
        default:
            this.tslPushNormalCharacter(textState);
            break;
    }
};

/**文本状态列表 添加处理字符 */
Window_Base.prototype.tslPushEscapeCode = function (textState) {
    textState.textindex++;
    var regExp = /^[\$\.\|\^!><\{\}\\\/\=]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return '';
    }
};

/**文本状态列表 添加处理字符 */
Window_Base.prototype.tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case 'C':
            this.tslPushTextColor(textState, this.tslPushTextColorEscapeParam(textState));
            break;
        
        case 'T':
            this.tslPushPicParam(textState)
            break;
        case 'K':
            this.tslPushKongGe(textState);
            break;
        case 'I':
            this.tslPushDrawIcon(textState, this.tslPushEscapeParam(textState));
            break;
        case '{':
            this.tslPushChangeFontSize(textState, 1);
            break;
        case '}':
            this.tslPushChangeFontSize(textState, -1);
            break;
        case '=':
            this.tslPushChangeFontBlod(textState);
            break;
        case '/':
            this.tslPushChangeFontItalic(textState);
            break;
        case 'OC':
            this.tslPushOutColor(textState, this.tslPushTextColorEscapeParam(textState));
            break;
        case 'OW':
            this.tslPushOutWidth(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'WJ':
            this.tslPushWJ(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'HJ':
            this.tslPushHJ(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'Y':
            this.tslPushNewPageY(textState)
            break
        case 'NY':
            this.tslPushNewPageY2(textState)
            break
        case 'F':
            this.tslPushFaceParam(textState)
            break;
        case 'T':
            this.tslPushPicParam(textState)
            break;
        case 'PH':
            this.tslPushPH(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'HT':
            this.tslPushHT(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'WT':
            this.tslPushWT(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'AH':
            this.tslPushAH(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'AW':
            this.tslPushAW(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'WH':
            this.tslPushWH(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'DXY':
            this.tslPushDXY(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'TWH':
            this.tslPushTWH(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'CWH':
            this.makeNewContents(textState, this.tslPushEscapeParamEx(textState));
            break;
        case 'PS':
        case 'PM':
        case 'PO':
        case 'PR':
        case 'PRT':
        case 'PT':
        case 'PE':
        case 'PEA':
        case 'PES':
        case 'PZ':
            this.setP(code, this.obtainEscapeParamExs(textState), textState)
            break;
        case 'FF':
        case 'FFR':
        case 'FS':
        case 'FSR':
        case 'FC':
        case 'FCR':
        case 'FI':
        case 'FB':
        case 'FR':
            this.setF(code, this.obtainEscapeParamExs(textState), textState)
            break;
        case 'BS':
            this.setBackShow(this.obtainEscapeParamExs(textState), textState);
            break;
    }
};






Window_Base.prototype.obtainEscapeParamExs = function (textState) {
    var arr = /^\[\[(.*?)\]\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        var re = "[" + arr[1] + "]"
        return JSON.parse(re)
    }
    return arr;
};


Window_Base.prototype.setF = function (code, list, textState) {
    switch (code) {
        //当 "C"
        case 'FF':
            this.contents.fontFace = list[0]
            break;
        case 'FFR':
            this.contents.fontFace = this.standardFontFace();
            break;
        case 'FS':
            this.contents.fontSize = list[0]
            break;
        case 'FSR':
            this.contents.fontSize = this.standardFontSize();
            break;
        case 'FC':
            this.changeTextColor(list[0]);
            break;
        case 'FCR':
            this.resetTextColor()
            break;
        case 'FI':
            this.contents.fontItalic = list[0]
            break;
        case 'FB':
            this.contents.fontBold = list[0]
            break;
        case 'FR':
            this.resetFontSettings()
            break;
    };
    if (textState) {
        this.tslPushParam(textState, code, list)
    }
}


Window_Base.prototype.setP = function (code, list, textState) {
    if (textState) {
        this.tslPushParam(textState, code, list)
        if (code == "PS") {
            /*   if (list[1]) {
                   if (list[1].indexOf("t/") == 0) {
   
                   } else if (list[1].indexOf("f/") == 0) {
                       var json = list[1].slice(5)
                       if (json) {
                           var l = JSON.parse("[" + json + "]")
                           ImageManager.loadFace(l[0] || "");
                       }
                   } else {
                       ImageManager.loadPicture(list[1])
                   }
               }*/
        }

    } else {
        switch (code) {
            case 'PS':
                this.showPicture(list, textState);
                break;
            case 'PM':
                this.movePicture(list, textState);
                break;
            case 'PO':
                this.anchorPicture(list, textState);
                break;
            case 'PR':
                this.rotatePicture(list, textState);
                break;
            case 'PRT':
                this.rotatePictureTo(list, textState);
                break;
            case 'PT':
                this.tintPicture(list, textState);
                break;
            case 'PE':
                this.erasePicture(list, textState);
                break;
            case 'PEA':
                this.erasePictureAll(list, textState);
                break;
            case 'PES':
                this.savePictureAll(list, textState);
                break;
            case 'PZ':
                this.zindexPicture(list, textState);
                break;
        };
    }
}



/**设置底显示  */
Window_Base.prototype.setBackShow = function (list, textState) {

    if (textState) {
        this.tslPushParam(textState, "BS", list)
    } else {
        this._windowSpriteContainer.visible = (list[0]) ? true : false
    }
};



/**设置底显示  */
/*
Window_Base.prototype.setBackShow = function(list, textState) {
    this._windowSpriteContainer.visible = (list[0]) ? true : false
};

*/

/**脸图位置 */
Window_Base.prototype.facePos = function () {
    return this._facepos || 0
}


/**文字间隔 */
Window_Base.prototype.jiange = function () {
    return this._jiange || 0
};

/**还原等待间隔 */
Window_Base.prototype.rejiange = function () {
    this._jiange = this.jiangebase()
};

/**等待间隔基础 */
Window_Base.prototype.jiangebase = function () {
    return 0
};

/**设置等待间隔 */
Window_Base.prototype.setJiange = function (i) {
    this._jiange = i
};

/**设置宽间隔 */
Window_Base.prototype.setWjg = function (jg) {
    this._wjg = jg || 0
};

/**设置宽间隔 */
Window_Base.prototype.getWjg = function () {
    return this._wjg
};

Window_Base.prototype.reWjg = function () {
    this.setWjg(0)
};


Window_Base.prototype.setHjg = function (jg) {
    this._hjg = jg || 0
};

Window_Base.prototype.getHjg = function () {
    return this._hjg
};

Window_Base.prototype.reHjg = function () {
    this.setHjg(0)
};


Window_Base.prototype.setKg = function (jg) {
    this._kg = jg || 0
};
Window_Base.prototype.reKg = function () {
    this.setKg(0)
};


Window_Base.prototype.rejg = function () {
    this.reWjg()
    this.reHjg()
};


/**文本状态列表 添加行间隔 */
Window_Base.prototype.tslPushWJ = function (textState, wjg) {
    this.setWjg(wjg)
    var obj = {
        "type": "wjg",
        "value": wjg
    }
    this.tslPushOther(textState, obj)
};

/**文本状态列表 添加宽间隔 */
Window_Base.prototype.tslPushHJ = function (textState, hjg) {
    this.setHjg(hjg)
    var obj = {
        "type": "hjg",
        "value": hjg
    }
    this.tslPushOther(textState, obj)
};



Window_Base.prototype.tslPushDXY = function (textState, list) {
    if (textState && textState.page && textState.page.set) {
        textState.page.set.draw.x = (list[0] || 0) * 1
        textState.page.set.draw.y = (list[1] || 0) * 1
    }
    var obj = {
        "type": "dxy",
        "value": list
    }
    this.tslPushOther(textState, obj)
};

Window_Base.prototype.tslPushWH = function (textState, list) {
    if (textState && textState.page && textState.page.set) {
        textState.page.set.w = (list[0] || 0) * 1
        textState.page.set.h = (list[1] || 0) * 1
    }
    var obj = {
        "type": "wh",
        "value": list
    }
    this.tslPushOther(textState, obj)
};

Window_Base.prototype.makeNewContents = function (textState, list) {
    var w = (list && (list[0] || 0) * 1) || this.windowWidth();
    var h = (list && (list[1] || 0) * 1) || this.windowHeight()
    this.contents = new Bitmap(w, h);
    this.resetFontSettings();
};

/**添加新行 */
Window_Base.prototype.tslPushNewLine = function (textState) {
    textState.textindex++;
    this.tslPushLine(textState)
};

/**进行行对象 */
Window_Base.prototype.tslPushNewLineL = function (textState) {
    var line = textState.line
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        line.cs = arr[1]
    }
};

/**进行新页对象 */
Window_Base.prototype.tslPushNewPage = function (textState) {
    textState.textindex++
    this.tslPushPage(textState)
    this.tslPushLine(textState)
    this.resetFontSettings();
};

/**进行新页对象 */
Window_Base.prototype.tslPushNewPageY = function (textState) {
    var page = this.makePage(textState)

    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        textState.textindex += arr[0].length;
        page.set.wz = arr[1] * 1
    }
    //console.log(arr)
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

Window_Base.prototype.tslPushNewPageY2 = function (textState) {
    var page = this.makePage(textState)

    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        textState.textindex += arr[0].length;
    }
    if (textState.page) {
        page.set = textState.page.set

    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

/**添加排版横向种类 */
Window_Base.prototype.tslPushWT = function (textState, wjg) {
    textState.page.set.wtype = wjg
};

/**添加排版竖向向种类 */
Window_Base.prototype.tslPushHT = function (textState, wjg) {
    textState.page.set.htype = wjg
};


/**添加自动宽种类 */
Window_Base.prototype.tslPushAW = function (textState, wjg) {
    textState.page.set.autow = wjg
};

/**添加自动高种类 */
Window_Base.prototype.tslPushAH = function (textState, wjg) {
    textState.page.set.autoh = wjg
};

/**添加等待标志隐藏 */
Window_Base.prototype.tslPushPH = function (textState, wjg) {
    var obj = {
        "type": "pahide",
        "value": wjg
    }
    this.tslPushOther(textState, obj)
};

Window_Base.textf = {}

/**处理正常字符 */
Window_Base.prototype.tslPushNormalCharacter = function (textState) {
    //c = 文本状态 [文本状态 索引++]


    if (this._kg) {
        var regExp = /^(\w+-?)+/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            if (arr[0]) {
                var t = arr[0]
                textState.textindex += t.length
                var tl = t.split("-")
                if (tl.length > 1) {
                    var obj = this.makeLCFText()
                    obj.lcfwh = this.loadText("-")
                    for (var i = 0; i < tl.length; i++) {
                        var fc = tl[i]
                        var re = this.loadText(fc)
                        var o = { text: fc }
                        o.w = re.w
                        o.h = re.h
                        obj.list.push(o)
                    }
                    this.tslPushOther(textState, obj)
                    return
                } else {
                    var re = this.loadText(t)
                    var text = this.makeText()
                    text.text = t
                    text.test.w = re.w
                    text.test.h = re.h
                    this.tslPushOther(textState, text)
                }
                return
            }
        }
        var regExp = /^ +/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            if (arr[0]) {
                var t = arr[0]
                textState.textindex += t.length
                var tl = this.loadText(t)
                var text = this.makeText()
                text.text = t
                text.test.w = re.w
                text.test.h = re.h
                this.tslPushOther(textState, text)
                return
            }
        }
    }


    var c = textState.text[textState.textindex++];
    var re = this.loadText(c)
    var text = this.makeText()
    text.text = c
    text.test.w = re.w
    text.test.h = re.h
    this.tslPushOther(textState, text)
};
/**设置改变粗体 */
Window_Base.prototype.tslPushKongGe = function (textState) {

    this.setKg(!this._kg)
    var obj = {
        "type": "liancifu",
        "value": this._kg
    }
    this.tslPushOther(textState, text)
}


/**读取文字 */
Window_Base.prototype.loadText = function (c) {
    //w = c 文本宽 
    var f = this.fontSettings()
    var textf = Window_Base.textf
    if (textf[f]) {
        if (textf[f][c]) {
            var w = textf[f][c]["w"]
            var h = textf[f][c]["h"]
        } else {
            var w = this.textWidth(c);
            var h = this.calcTextHeight()
            textf[f][c] = { w: w, h: h }
        }
    } else {
        textf[f] = {}
        var w = this.textWidth(c);
        var h = this.calcTextHeight()
        textf[f][c] = { "w": w, "h": h }
    }
    return textf[f][c]
}

/**添加空白文本宽高 */
Window_Base.prototype.tslPushTWH = function (textState, list) {
    var text = this.makeText()
    text.text = ""
    var w = list[0] * 1
    var h = list[1] * 1
    text.test.w = isFinite(w) ? w : 0
    text.test.h = isFinite(h) ? h : 0
    this.tslPushOther(textState, text)
};


/**添加文本颜色对象 */
Window_Base.prototype.tslPushTextColor = function (textState, color) {
    this.contents.textColor = color;
    var obj = {
        "type": "textColor",
        "value": color
    }
    this.tslPushOther(textState, obj)
};

/**添加描边颜色 */
Window_Base.prototype.tslPushOutColor = function (textState, color) {
    var obj = {
        "type": "outlineColor",
        "value": color
    }
    this.tslPushOther(textState, obj)
};

/**添加描边宽 */
Window_Base.prototype.tslPushOutWidth = function (textState, width) {
    var obj = {
        "type": "outlineWidth",
        "value": width
    }
    this.tslPushOther(textState, obj)
};


/**添加绘制图标 */
Window_Base.prototype.tslPushDrawIcon = function (textState, iconId) {
    var obj = this.makeIcon()
    obj.icon = iconId
    obj.test.w = Window_Base._iconWidth + 4;
    obj.test.h = Window_Base._iconHeight + 4;
    this.tslPushOther(textState, obj)
};

/**添加改变斜体 */
Window_Base.prototype.tslPushChangeFontItalic = function (textState) {
    var Italic = !this.contents.fontItalic
    var Italic = !!this.tslPushEscapeParam(textState, Italic)
    this.tslPushFontItalic(textState, Italic)
}

/**添加字体粗体 */
Window_Base.prototype.tslPushFontItalic = function (textState, Italic) {
    this.contents.fontItalic = Italic;
    var obj = {
        "type": "fontItalic",
        "value": Italic
    }
    this.tslPushFont(textState, obj)
};

/**设置改变粗体 */
Window_Base.prototype.tslPushChangeFontBlod = function (textState) {
    var bold = !this.contents.fontBold
    var bold = !!this.tslPushEscapeParam(textState, bold)
    this.tslPushFontBlod(textState, bold)
}

/**文本状态列表 添加粗体 */
Window_Base.prototype.tslPushFontBlod = function (textState, bold) {
    this.contents.fontBold = bold;
    var obj = {
        "type": "fontBold",
        "value": bold
    }
    this.tslPushFont(textState, obj)
};

/**字体 */
Window_Base.prototype.tslPushChangeFontSize = function (textState, i) {
    if (i > 0) {
        var arr = /^}/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this.tslPushFontSize(textState, parseInt(arr[1]));
            } else {
                this.tslPushFontSize(textState, this.standardFontSize());
            }
        } else {
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this.tslPushFontSize(textState, this.contents.fontSize + parseInt(arr[1]));
            } else {
                this.tslPushFontSize(textState, this.contents.fontSize + 12)
            }
        }
    } else if (i < 0) {
        var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            this.tslPushFontSize(textState, this.contents.fontSize - parseInt(arr[1]));
        } else {
            this.tslPushFontSize(textState, this.contents.fontSize - 12)
        }
    }
}


/**文本状态列表  添加字体 */
Window_Base.prototype.tslPushFontSize = function (textState, fontSize) {
    var fontSize = Math.min(108, Math.max(fontSize, 12))
    this.contents.fontSize = fontSize;
    var obj = {
        "type": "fontSize",
        "value": fontSize
    }
    this.tslPushFont(textState, obj)
};

/**文本状态列表 添加字体 */
Window_Base.prototype.tslPushFont = function (textState, obj) {
    this.fontSettings(1)
    this.tslPushOther(textState, obj)
};



/**文本状态列表添加脸图 */
Window_Base.prototype.tslPushFaceParam = function (textState) {
    var page = textState.page
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = (arr[0] || 0) * 1
        var name = arr[1]
        var id = (arr[2] || 0) * 1
        var face = {
            "type": "face",
            "pos": pos || 1,
            "name": name,
            "id": id
        }
        this.tslPushFace(textState, face)
    }
};

/**文本状态列表添加图片 */
Window_Base.prototype.tslPushPicParam = function (textState) {
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = arr[0] * 1
        var name = arr[1]
        var index = (arr[2] || 0) * 1
        var obj = {
            "type": "pic",
            "pos": pos,
            "name": name,
            "index": index
        }
        this.tslPushPic(textState, obj)
    }
};



/**获取参数 */
Window_Base.prototype.tslPushEscapeParam = function (textState, un) {
    if (un === undefined) {
        var un = ""
    } else {
        var un = un
    }
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        try {
            var i = arr[1] * 1
        } catch (error) {
            var i = un
        }
        return i;
    } else {
        return un;
    }
};

/**获取参数增强 */
Window_Base.prototype.tslPushEscapeParamEx = function (textState) {
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};

Window_Base.prototype.tslPushEscapeParamEx2 = function (textState) {
    var arr = /^\[\{(.*?)\}\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};


/**获取颜色参数 */
Window_Base.prototype.tslPushTextColorEscapeParam = function (textState) {
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return this.textColor(parseInt(arr[1]));
    } else {
        var arr = /^\[(#\w{6})\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            return arr[1]
        } else {
            var arr = /^\[(#\w{3})\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                return arr[1]
            } else {
                var arr = /^\[(rgba\((.*?)\))\]/.exec(textState.text.slice(textState.textindex));
                if (arr) {
                    textState.textindex += arr[0].length;
                    return arr[1]
                } else {
                    return this.normalColor();
                }
            }
        }
    }
};



/**文本内容宽 */
Window_Base.prototype.textContentsWidth = function () {
    return this.contentsWidth()
}



/**是结束在文本 */
Window_Base.prototype.isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};

/**需要新页 */
Window_Base.prototype.needsNewPage = function (textState) {
    return (!this.isEndOfText(textState) &&
        this.needsCharacter(textState) && (
            this.needsCharacter(textState).type == "page" ||
            this.needsCharacter(textState).type == "addpage")
    );
};




/**进行绘制对象 */
Window_Base.prototype.processDrawCharacter = function (textState) {
    var obj = this.needsCharacter(textState)
    if (obj) {
        switch (obj.type) {
            case "line":
            case "addline":
                textState.line = obj;
                textState.drawx =
                    /**绘制基础位置 */
                    textState.page.set.draw.x +
                    /**页开始位置 */
                    textState.page.test.x +
                    /**脸图位置 */
                    ((textState.page.set.facepos == 1 || textState.page.set.facepos == 3) ? 168 : 0) +
                    /**行位置 */
                    textState.line.test.x
                textState.drawy =
                    textState.page.set.draw.y +
                    textState.page.test.y +
                    textState.line.test.y
                break
            case "page":
            case "addpage":
                textState.page = obj;
                break
            case "fontSize":
            case "fontBold":
            case "fontItalic":
            case "textColor":
            case "outlineColor":
            case "outlineWidth":
                this.processFont(obj.type, obj.value);
                break
            case "text":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var w = obj.test.w
                var h = textState.line.test.h
                var c = obj.text
                this.processText(c, x, y, w * 2, h)
                this.processNormalCharacter2()
                break
            case "icon":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var h = textState.line.test.h
                var iconIndex = obj.icon
                this.processIcon(iconIndex, x + 2, y + 2);
                this.processNormalCharacter2()
                break
            case "pahide":
                this.pausehide = obj.value
                break
            case 'PS':
            case 'PM':
            case 'PO':
            case 'PR':
            case 'PRT':
            case 'PT':
            case 'PE':
            case 'PEA':
            case 'PES':
            case 'PZ':
                this.setP(obj.type, obj.value)
                break;
            case 'FF':
            case 'FFR':
            case 'FS':
            case 'FSR':
            case 'FC':
            case 'FCR':
            case 'FI':
            case 'FB':
            case 'FR':
                this.setF(obj.type, obj.value)
                break;
            case 'BS':
                this.setBackShow(obj.value);
                break;
        }
    }
}



Window_Base.prototype.processFont = function (type, value) {
    this.drawBitmapFont(this.contents, type, value)
}


Window_Base.prototype.processText = function (c, x, y, w, h) {
    this.drawBitmapText(this.contents, c, x, y, w, h)
}

Window_Base.prototype.processIcon = function (iconIndex, x, y) {
    this.drawBitmapIcon(this.contents, iconIndex, x, y)
}


Window_Base.prototype.cloneBitmapFont = function (b, b2) {
    var font = this.saveFontSettings(b2)
    this.loadFontSettings(b, font)
}

Window_Base.prototype.drawBitmapFont = function (b, type, value) {
    b && (b[type] = value)
};

Window_Base.prototype.drawBitmapIcon = function (b, iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    b && b.blt(bitmap, sx, sy, pw, ph, x, y);
};
Window_Base.prototype.drawBitmapText = function (b, c, x, y, w, h) {
    b && b.drawText(c, x, y, w, h);
};


/**添加参数 */
Window_Message.prototype.tslPushParam = function (textState, name, value) {
    var obj = {
        "type": name,
        "value": value
    }
    this.tslPushOther(textState, obj)
};



/**文本状态列表 添加头 */
Window_Message.prototype.tslPushHear = function (textState) {
    if (textState.text[0] == '\x1b') {
        if (this.tslPushEscapeCode(textState) == "Y") {
            this.tslPushNewPageY(textState)
            this.tslPushHear2(textState)
            return
        }
    }

    if (!textState.page) {
        this.tslPushNewPage(textState)
        this.tslPushHear2(textState)
    }
    textState.textindex = 0
};



/**文本状态列表测试新页对象 */
Window_Message.prototype.tslPushNewPage = function (textState) {
    textState.textindex++
    var page = this.makePage(textState)
    var line = this.makeLine(textState)
    var type = this.positionType()
    page.set.wz = type
    if (type == 0) {
        page.set.wtype = 1
        page.set.htype = 0
    } else {
        page.set.wtype = 0
        page.set.htype = 0
    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};



/**文本状态列表添加头2 */
Window_Message.prototype.tslPushHear2 = function (textState) {
    if ($gameMessage.faceName()) {
        var pos = $gameMessage.facePos()
        var name = $gameMessage.faceName()
        var id = $gameMessage.faceIndex()
        var face = {
            "type": "face",
            "pos": 1,
            "name": name,
            "id": id
        }
        ImageManager.loadFace(name)
        this.tslPushFace(textState, face)
    }
};



Window_Message.prototype.tslPushFace = function (textState, face) {
    if (face) {
        ImageManager.loadFace(face.name)
        var page = textState.page
        if (!page.set.facepos) {
            page.set.facepos = face.pos
        } else {
            if (face.pos != page.set.facepos) {
                page.set.facepos = 3
            }
        }
        if (face.pos == 1 || face.pos == 0) {
            var pid = -1
        } else {
            var pid = -2
        }


        page.set.ps = page.set.ps || {}
        page.set.ps[pid] = face.name
        this.tslPush(textState, face)
    }
}





/**文本状态列表添加新页对象 */
Window_Message.prototype.tslPushNewPageY = function (textState) {
    var page = this.makePage(textState)
    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var type = arr//[0] * 1
        page.set.wz = type

        page.set.wtype = 0
        page.set.htype = 0
        page.set.autoh = 1
        page.set.autow = 1

    }
    //console.log(arr)
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};


/**文本状态列表添加其他信息 */
Window_Message.prototype.tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case '$':
            this.tslPushParam(textState, "gold")
            break;
        case '.':
            this.tslPushParam(textState, "wait", this.tslPushEscapeParam(textState, 15));
            break;
        case '|':
            this.tslPushParam(textState, "wait", this.tslPushEscapeParam(textState, 60));
            break;
        case '!':
            this.tslPushParam(textState, "pause")
            break;
        case '>':
            this.tslPushParam(textState, "showfast", true)
            break;
        case '<':
            this.tslPushParam(textState, "showfast", false)
            break;
        case '^':
            this.tslPushParam(textState, "pauseskip", true)
            break;

        case 'PK':
            this.tslPushParam(textState, "pauseskip", this.tslPushEscapeParam(textState, false))
            break;

        case 'S':
            this.tslPushParam(textState, "jiange", this.tslPushEscapeParam(textState, 0))
            break;
        default:
            Window_Base.prototype.tslPushEscapeCharacter.call(this, textState, code);
            break;
    }
};



Window_Message.prototype.clearSkipFlags = function () {
    this._showFast = false;
    this._pauseSkip = false;
};

Window_Message.prototype.clearlineShowFast = function () {
    this._lineShowFast = false;
};

Window_Message.prototype.clearPicture = function (page) {

    //var ps = (page.set && page.set.ps) || {}

    this.addScreen()
    this._screen.clearPictures()
}

/**进行绘制普通 */
Window_Message.prototype.processDrawCharacter = function (textState) {
    var obj = this.needsCharacter(textState)
    if (obj) {
        switch (obj.type) {
            case "page":
                this.rejiange()
                this.clearPicture(obj)
                //this.clearFace()
                this.resetFontSettings();
                this.clearlineShowFast();
            case "addpage":
                textState.page = obj;
                var page = obj
                this.contents.clear();
                if (this._cloneBitmap) {
                    this._cloneBitmap.clear();
                    this.cloneBitmapFont(this._cloneBitmap, this.contents)
                }
                if (page.set) {
                    if ("wz" in page.set) {
                        this.setPositionType(page.set.wz)
                        this.updatePlacement();
                    }
                }
                this.clearSkipFlags()
                break
            case "gold":
                this._goldWindow.open();
                break
            case "wait":
                var z = obj.value
                this.startWait(z)
                break
            case "pause":
                this.startPause();
                break
            case "showfast":
                var z = obj.value
                this._lineShowFast = z;
                break
            case "pauseskip":
                this._pauseSkip = obj.value;
                break
            case "jiange":
                var z = obj.value
                this.setJiange(z)
                break
            case "face":
                var face = obj
                this.showMessageFace(face.name, face.id, face.pos, textState)
                break
            case "pic":
                var pos = obj.pos
                var name = obj.name
                var index = obj.index
                if (pos < 10) {
                    var origin = pos
                    var o = pos
                } else {
                    var origin = (Math.floor(pos / 10)) % 10
                    var o = pos % 10
                }
                var x = ((o - 1) % 3) * 0.5 * this.width
                var y = (1 - Math.floor((o - 1) / 3) * 0.5) * this.height
                var scaleX = 100
                var scaleY = 100
                var opacity = 255
                var blendMode = 0
                this.showPicture([index, name, origin, x, y, scaleX, scaleY, opacity, blendMode])
                this.zindexPicture([index, -1])
                break
            default:
                Window_Base.prototype.processDrawCharacter.call(this, textState)
        }
    }
}

Window_Message.prototype.processFont = function (type, value) {
    this.drawBitmapFont(this.contents, type, value)
    if (this._cloneBitmap) {
        this.drawBitmapFont(this._cloneBitmap, type, value)
    }
}


Window_Message.prototype.processText = function (c, x, y, w, h) {
    this.drawBitmapText(this.contents, c, x, y, w, h)
    if (this._cloneBitmap) {
        this.drawBitmapText(this._cloneBitmap, c, x, y, w, h)
    }
}

Window_Message.prototype.processIcon = function (iconIndex, x, y) {
    this.drawBitmapIcon(this.contents, iconIndex, x, y)
    if (this._cloneBitmap) {
        this.drawBitmapIcon(this._cloneBitmap, iconIndex, x, y)
    }
}



Window_Message.prototype.updatePlacement2 = function () {
    var y = 2 * (Graphics.boxHeight - this.height) / 2;

    var x = (Graphics.boxWidth - this.width) / 2;

    var w = this.windowWidth()
    var h = this.windowHeight()
    this.move(x, y, w, h);
}


Window_Message.prototype.positionType = function () {
    return this._positionType
};


Window_Message.prototype.setPositionType = function (positionType) {
    return this._positionType = positionType
}

Window_Message.prototype.updateBackground = function (background) {
    this._background = background;
    this.setBackgroundType(this._background);
};


/**更新位置 */
Window_Message.prototype.updatePlacement = function () {
    var postype = this.positionType();

    //console.log(postype)
    var w = this.windowWidth()
    var h = this.windowHeight()

    var trueh = h
    if (this._textState) {
        var page = this._textState.page
        if (page) {
            var set = page.set
            var p = set && set.facepos


            var fw = Window_Base._faceWidth + 24
            var fh = Window_Base._faceHeight + 24;

            var aw = set && set.autow

            var ah = set && set.autoh

            var sp2 = this.standardPadding()
            sp2 += sp2 //窗口间隔 
            if (aw == 2) {
                w = page.set.w + sp2
            }
            if (aw == 1 || w == Infinity) {
                w = page.test.x + page.test.w
                w += (p == 3 ? (fw * 2) : (p ? fw : 0))
                w += sp2
            }
            if (ah == 2) {
                h = page.set.w + sp2
            }
            if (ah == 1 || h == Infinity) {
                var h = page.test.y + page.test.h
                h = h//p ? Math.max(h, fh) : h
                h += sp2
            }
            var trueh = p ? Math.max(h, fh) : h
        }
    }

    if (typeof (postype) == "number") {
        var y = postype * (Graphics.boxHeight - h) / 2;
        var x = (Graphics.boxWidth - w) / 2;
    } else if (Array.isArray(postype)) {
        var types = postype
        var type = (types[0] || 0) * 1
        var id = (types[1] || 0) * 1
        var cex = types[2] === undefined ? 0.5 : types[2] * 1
        var cey = types[3] === undefined ? 0.5 : types[3] * 1
        var wex = types[4] === undefined ? 0.5 : types[4] * 1
        var wey = types[5] === undefined ? 0.5 : types[5] * 1
        var wdx = (types[6] || 0) * 1
        var wdy = (types[7] || 0) * 1

        //console.log(type, id, cex, cey)
        var rx = 0
        var ry = 0
        var rw = 1
        var rh = 1
        if (type == 8) {
            if (id == 4) {
                var rx = 0
                var ry = 0
                var rw = Graphics._width
                var rh = Graphics._height
            }
            if (id == 1) {
                var rx = 0
                var ry = 0
                var rw = SceneManager._screenWidth
                var rh = SceneManager._screenHeight
            }
            if (id == 2) {
                var rw = SceneManager._boxWidth
                var rh = SceneManager._boxHeight
                var rx = (SceneManager._screenWidth - SceneManager._boxWidth) * 0.5
                var ry = (SceneManager._screenHeight - SceneManager._boxHeight) * 0.5
            }
            if (id == 0) {
                var rx = 0
                var ry = 0
                var rw = 1
                var rh = 1
            }
            if (id == 3) {
                var rx = 0
                var ry = 0
                var rw = SceneManager._screenWidth
                var rh = SceneManager._screenHeight
            }
        } else {

            var actor
            var character
            if (type == 3) {
                if (id > 0) {
                    character = $gamePlayer.followers().follower(id - 1)
                    actor = $gameParty.members()[id]
                }
                if (!character) {
                    character = $gamePlayer
                }

                if (!actor) {
                    actor = $gameParty.members()[0]
                }
            }
            if (type == 4) {
                character = $gameMap.event(id);
                if (!character) {
                    character = $gameMap.event($gameMap._interpreter.eventId())
                }
                if (!character) {
                    character = $gamePlayer
                }
            }

            /**队伍 */
            if (type == 5) {
                actor = $gameParty.members()[id]
                if (!actor) {
                    $gameParty.members()[0]
                }
            }
            /**角色 */
            if (type == 6) {
                actor = $gameActors.actor(id)
                if (!actor) {
                    actor = $gameParty.members()[0]
                }
            }
            /**敌人 */
            if (type == 7) {
                actor = $gameTroop.members()[id]
                if (!actor) {
                    actor = $gameParty.members()[0]
                }
            }
            if (SceneManager._scene.constructor === Scene_Map) {
                if (type == 5 || type == 6 || type == 7) {
                    var pid = 0
                    var l = $gameParty.members()
                    for (var i = 0; i < l.length; i++) {
                        if (l[i] == actor) {
                            pid = i
                        }
                    }
                    if (pid == 0) {
                        character = $gamePlayer
                    } else {
                        character = $gamePlayer.followers().follower(pid - 1)
                    }
                    if (!character) {
                        character = $gamePlayer
                    }
                }
                var ns
                var ps
                var ss = SceneManager._scene._spriteset._characterSprites
                for (var i = 0; i < ss.length; i++) {
                    var s = ss[i]
                    if (s && s._character == character) {
                        ns = s
                    }
                    if (s && s._character == $gamePlayer) {
                        ps = s
                    }
                }
                if (!ns) {
                    ns = ps
                }
                if (!ns) {
                    this.updatePlacement2()
                    return
                }
                var px = ns.x
                var py = ns.y
                var pw = ns.patternWidth()
                var ph = ns.patternHeight()

                var rx = px - pw * 0.5
                var ry = py - ph * 1
                var rw = pw
                var rh = ph
            }
            if (SceneManager._scene.constructor === Scene_Battle) {

                if (!actor) {
                    this.updatePlacement2()
                    return
                }
                var ns
                var ps
                var ss = SceneManager._scene._spriteset.battlerSprites()
                for (var i = 0; i < ss.length; i++) {
                    var s = ss[i]
                    if (s && s._battler == actor) {
                        ns = s
                    }
                    if (s && s._battler == $gameParty.members()[0]) {
                        ps = s
                    }
                }
                if (!ns) {
                    ns = ps
                }
                if (!ns) {
                    this.updatePlacement2()
                    return
                }
                if (ns.constructor == Sprite_Enemy) {
                    var rx = ns.x
                    var ry = ns.y
                    var rw = ns.bitmap.width
                    var rh = ns.bitmap.height
                } else if (ns.constructor == Sprite_Actor) {
                    var px = ns.x
                    var py = ns.y
                    var pw = ns._mainSprite.bitmap.width
                    var ph = ns._mainSprite.bitmap.height

                    var rx = px - pw * 0.5
                    var ry = py - ph * 1
                    var rw = pw
                    var rh = ph

                } else {
                    var rx = ns.x
                    var ry = ns.y
                    var rw = 0
                    var rh = 0
                }

            }
        }



        var x = rx + cex * rw - w * wex + wdx
        var y = ry + cey * rh - h * wey + wdx
    }



    var u = 0
    var d = 0
    var l = 0
    var r = 0
    var sw = SceneManager._screenWidth
    var sh = SceneManager._screenHeight




    var zx = l
    var zy = u + trueh - h
    var sx = sw - r
    var sy = sh - d
    var mx = sx - w
    var my = sy - h

    x = Math.min(x, mx)
    x = Math.max(x, zx)
    y = Math.min(y, my)
    y = Math.max(y, zy)

    this.move(x, y, w, h);
    var ir = mx - x > x - zx
    var id = my - y > y - zy

    this._goldWindow.y = id ? sy - this._goldWindow.height : u;
    this._goldWindow.x = ir ? sx - this._goldWindow.width : l;
};



/**开始信息 */
Window_Message.prototype.startMessage = function () {
    var positionType = $gameMessage.positionType()
    var background = $gameMessage.background()
    var allText = $gameMessage.allText()

    this.setPositionType(positionType)
    this._textState = this.testTextEx(allText, 0, 0, this.contents.width, this.contents.height)
    this.newPage(this._textState, 1);
    this.updatePlacement();
    this.updateBackground(background);
    this.open();
};

Window_Message.prototype.updateWait = function () {
    if (this._waitCount > 0) {
        this._waitCount--;
        this.updateShowFast();
        if (this._showFast) {
            this._waitCount = 0
        }
        return true;
    } else {
        return false;
    }
};


/**更新信息 */
Window_Message.prototype.updateMessage = function () {
    if (this._textState) {
        while (!this.isEndOfText(this._textState)) {
            this.updateShowFast();
            this.processDrawCharacter(this._textState);
            this._textState.index++
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            if (this._showFast) {
                if (this.pause) {
                    this._showFast = false
                    break
                }
            } else {
                if (!this._lineShowFast) {
                    break
                }
                if (this.pause || this._waitCount > 0) {
                    break;
                }
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};


Window_Message.prototype.startInput = function () {
    if ($gameMessage.isChoice()) {
        this._choiceWindow.start();
        //console.log("start", this)
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        this._itemWindow.start();
        return true;
    } else {
        return false;
    }
};


/**新页 */
Window_Message.prototype.newPage = function (textState, cs) {
    if (textState) {
        textState.page = textState.list[textState.index]
        var page = textState.page
        if ("wz" in page.set) {
            this.setPositionType(page.set.wz)
        }
    }
    if (!this._pauseSkip && !cs) {
        this.startPause();
    }
};


/**是文本最后 */
Window_Message.prototype.isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};

/**需要新页 */
Window_Message.prototype.needsNewPage = function (textState) {
    return (!this.isEndOfText(textState) &&
        this.needsCharacter(textState) && (
            this.needsCharacter(textState).type == "page" ||
            this.needsCharacter(textState).type == "addpage")
    );
};

/**结束信息 */
Window_Message.prototype.terminateMessage = function () {
    this.erasePictureAll()
    this.close();
    this._goldWindow.close();
    $gameMessage.clear();
};








/**设置脸图 */
Game_Message.prototype.setFaceImage = function (faceName, faceIndex, facepos) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
    this._facepos = facepos || 1
};


Game_Message.prototype.facePos = function () {
    return this._facepos
};




/**进行普通文字处理2 */
Window_Base.prototype.processNormalCharacter2 = function () { };





Window.prototype._updatePauseSign = function () {
    var sprite = this._windowPauseSignSprite;
    var x = Math.floor(this._animationCount / 16) % 2;
    var y = Math.floor(this._animationCount / 16 / 2) % 2;
    var sx = 144;
    var sy = 96;
    var p = 24;
    if (!this.pause) {
        sprite.alpha = 0;
    } else if (sprite.alpha < 1) {
        if (this.pausehide) {
            sprite.alpha = 0;
        } else {
            sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
        }
    }
    sprite.setFrame(sx + x * p, sy + y * p, p, p);
    sprite.visible = this.isOpen();
};




/**窗口宽 */
Window_Message.prototype.windowWidth = function () {
    return Graphics.width
};




/**进行普通文字处理2 */
Window_Message.prototype.processNormalCharacter2 = function () {
    this.startWait(this.jiange())
};

/**绘制信息脸图 */
Window_Message.prototype.drawMessageFace = function () { };



Window_Message.prototype.showMessageFace = function (face, id, pos, textState) {

    var name = "f/" + '["' + face + '",' + id + "]"


    //自动高
    var autoh = textState.page.autoh
    var autow = textState.page.autow

    var h = this.contentsHeight()
    if (autoh) {

        h = textState.page.test.h
    }

    //
    var w = this.contentsWidth()
    if (autow) {

        w = textState.page.test.w
    }

    //console.log(w, h)
    if (h >= 144) {
        var y = 0
    } else {
        var y = h - 144
    }

    //左侧的脸图
    if (pos == 1 || pos == 0) {
        var x = 0
        var pid = -1
    } else {
        //如果是自动宽
        if (autow) {
            if (textState.page.test.facepos != 2) {
                // 内容宽 + 脸图宽 + 24 +24
                var x = w + Window_Base._faceWidth + 24 + 24
                var pid = -2
            } else {
                var x = w
                var pid = -2
            }
        } else {
            // 内容宽 - 脸图宽 - 24
            var x = w - Window_Base._faceWidth - 24
            var pid = -2
        }


    }
    x += this.standardPadding()
    y += this.standardPadding()
    this.showPicture([pid, name, 0, x, y])
};



/**清除脸图 */
Window_Message.prototype.clearFace = function (pos) {
    if (pos === undefined) {
        this.erasePicture([-1])
        this.erasePicture([-2])
    }
    if (pos == 1 || pos == 0) {
        this.erasePicture([-1])
    } else {
        this.erasePicture([-2])
    }
};


/**更新位置 */
Window_ChoiceList.prototype.updatePlacement = function () {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    var messageX = this._messageWindow.x;
    var messageW = this._messageWindow.width;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
        case 0:
            this.x = messageX;
            break;
        case 1:
            this.x = messageX + (messageW - this.width) / 2;
            break;
        case 2:
            this.x = messageX + (messageW - this.width);
            break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};



Window_ChoiceList.prototype.textWidthEx = function (text) {
    var te = this.testTextEx(text, 0, 0, 0, this.contents.height)

    if (te && te.list && te.list[0]) {
        return te.list[0].test.w;
    } else {
        return 0
    }
};




/**更新图片*/
Window_Base.prototype.picture = function (pictureId) {
    this.addScreen()
    return this._screen.picture(pictureId)
};



/**更新图片*/
Window_Base.prototype.updatePictures = function () {
    if (this._screen) {
        this._screen.update()
    }
};

Window_Base.prototype.addScreen = function () {

    if (!this._screen) {
        this._screen = new Game_Screen()
        this._pictureContainer = new Sprite_WindowPicture(this._screen);
        ///this._pictureContainer.setFrame(x, y, width, height);
        this.addChild(this._pictureContainer)
    }
}

/**显示图片
 * @param {number} pictureId 图片id
 * @param {number} origin 原点
 * @param {number} x x
 * @param {number} y y
 * @param {number} scaleX 比例x
 * @param {number} scaleY 比例y
 * @param {number} opacity 不透明度
 * @param {number} blendMode 混合模式  
 */
Window_Base.prototype.showPicture = function (list) {
    var pictureId = list[0]
    var name = list[1]
    var origin = list[2] || 0
    var x = list[3] || 0
    var y = list[4] || 0
    var scaleX = list[5] === undefined ? 100 : list[5]
    var scaleY = list[6] === undefined ? 100 : list[6]
    var opacity = list[7] === undefined ? 255 : list[7]
    var blendMode = list[8] || 0
    this.addScreen()
    this._screen.showPicture(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
};

/**设置图片z值 */
Window_Base.prototype.zindexPicture = function (list) {
    this.addScreen()
    var pictureId = list[0]
    var zindex = list[1]
    var picture = this.picture(pictureId)
    if (picture) {
        picture._zIndex = zindex
    }
};

/**设置图片坐标 */
Window_Base.prototype.anchorPicture = function (list) {
    var pictureId = list[0]
    var picture = this.picture(pictureId);
    if (picture) {
        picture.origin = list[1]
    }
};



/**移动图片
 * @param {number} pictureId 图片id
 * @param {number} origin 原点
 * @param {number} x x
 * @param {number} y y
 * @param {number} scaleX 比例x
 * @param {number} scaleY 比例y
 * @param {number} opacity 不透明度
 * @param {number} blendMode 混合模式 
 * @param {number} duration 持续时间 
 */
Window_Base.prototype.movePicture = function (list) {
    var pictureId = list[0]
    var origin = list[1] || 0
    var x = list[2] || 0
    var y = list[5] || 0
    var scaleX = list[4] === undefined ? 100 : list[4]
    var scaleY = list[5] === undefined ? 100 : list[5]
    var opacity = list[6] === undefined ? 255 : list[6]
    var blendMode = list[7] || 0
    var duration = list[8] || 0
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};
/**旋转图片
 * @param {number} pictureId 图片id
 * @param {number} speed 速度
 * 
 */
Window_Base.prototype.rotatePicture = function (list) {
    var pictureId = list[0]
    var speed = list[1]
    var picture = this.picture(pictureId);
    if (picture) {
        picture.rotate(speed);
    }
};
/**着色图片
 * @param {number} pictureId 图片id
 * @param {[number,number,number,number]} tone 色调
 * @param {number}  duration 持续时间
 * 
 */
Window_Base.prototype.tintPicture = function (list) {
    var pictureId = list[0]
    var tone = list[1]
    var duration = list[2]
    var picture = this.picture(pictureId);
    if (picture) {
        picture.tint(tone, duration);
    }
};


/**抹去图片
 * @param {number} pictureId 图片id
 * */
Window_Base.prototype.erasePicture = function (list) {
    var pictureId = list[0]
    this.addScreen()
    this._screen.erasePicture(pictureId);
};


Window_Base.prototype.savePictureAll = function () {
    this._savePicture = true
};
/**
 * 抹去所有图片
 */
Window_Base.prototype.erasePictureAll = function () {
    if (this._savePicture) { return this._savePicture = false }
    this.addScreen()
    this._screen.clearPictures()
};



Window_Base.prototype.rotatePictureTo = function (pictureId, rotation, duration) {
    var pictureId = list[0]
    var rotation = list[1]
    var duration = list[2]
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.rotateTo(rotation, duration);
    }
};



function Sprite_WindowPicture() {
    this.initialize.apply(this, arguments);
}


/**设置原形  */
Sprite_WindowPicture.prototype = Object.create(Sprite_Picture.prototype);
/**设置创造者 */
Sprite_WindowPicture.prototype.constructor = Sprite_WindowPicture;


Sprite_WindowPicture.prototype.setScreen = function (screen) {
    this._screen = screen
};


Sprite_WindowPicture.prototype.screen = function () {
    return this._screen

};
Sprite_WindowPicture.prototype.picture = function () {
    return this.screen() && this.screen().picture && this.screen().picture(this._pictureId);
};


Sprite_Picture.prototype.loadBitmap = function () {
    if (this._pictureName) {
        //console.log(this._pictureName)

        if (this._pictureName.indexOf("text/") == 0) {
            var json = this._pictureName.slice(5)
            if (json) {
                var list = JSON.parse("[" + json + "]")
                var w = list[0] || 0
                var h = list[1] || 0
                var text = list[2] || ""
                var wb = new Window_Base(0, 0, 1, 1)
                wb.contents = new Bitmap(w, h)
                wb.drawTextEx(text, 0, 0)
                this.bitmap = wb.contents
                wb.contents = new Bitmap(0, 0)
                wb = null
            } else {
                this.bitmap = new Bitmap()
            }
        } else if (this._pictureName.indexOf("face/") == 0) {
            var json = this._pictureName.slice(5)
            if (json) {
                var list = JSON.parse("[" + json + "]")
                var faceName = list[0] || ""
                var faceIndex = list[1] || 0
                this.bitmap = ImageManager.loadFace(faceName);
                var that = this
                this.bitmap.addLoadListener(
                    function () {
                        var pw = Window_Base._faceWidth;
                        var ph = Window_Base._faceHeight;
                        var sw = pw
                        var sh = ph
                        var sx = faceIndex % 4 * pw + (pw - sw) / 2;
                        var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
                        that.setFrame(sx, sy, sw, sh);
                    }
                )
            } else {
                this.bitmap = new Bitmap()
            }
        } else {
            this.bitmap = ImageManager.loadPicture(this._pictureName);
        }
    } else {
        this.bitmap = ImageManager.loadPicture("");
    }
}





Sprite_Picture.prototype.updateOrigin = function () {
    var picture = this.picture();
    var o = picture.origin()
    if (Array.isArray(o)) {
        this.anchor.x = o[0];
        this.anchor.y = o[1];
    } else {
        if (picture.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    }
};


Sprite_WindowPicture.prototype.updateOrigin = function () {
    var picture = this.picture();
    var o = picture.origin()
    if (Array.isArray(o)) {
        this.anchor.x = o[0];
        this.anchor.y = o[1];
    } else {
        if (o > 0 && o < 10) {
            var x = ((o - 1) % 3) * 0.5
            var y = 1 - Math.floor((o - 1) / 3) * 0.5
            this.anchor.x = x;
            this.anchor.y = y;
        } else {
            this.anchor.x = 0;
            this.anchor.y = 0;
        }
    }
};