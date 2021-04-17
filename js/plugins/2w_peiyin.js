(function () {



    var ww = ww || {}

    ww.deepClone = function (that) {
        var that = that
        var obj, i;
        if (typeof (that) === "object") {
            if (that === null) {
                obj = null;
            } else if (Array.isArray(that)) {  //Object.prototype.toString.call(that) === '[object Array]') { 
                obj = [];
                for (var i = 0; i < that.length; i++) {
                    obj.push(ww.deepClone(that[i]));
                }
            } else {
                obj = {}
                for (i in that) {
                    obj[i] = ww.deepClone(that[i])
                }
            }
        } else {
            obj = that
        }
        return obj;
    };


    ww.anm = {}


    ww.anm.anmToObj = function (obj) {
        var tl = typeof obj
        if (tl == "number") {
            return { t: obj }
        } else if (tl && tl == "object") {
            return ww.deepClone(obj)
        } else {
            return 0
        }
    }

    /**值的赋予 */

    ww.anm.getSpriteValue = function (o1, name1) {
        if (Array.isArray(name1)) {
            for (var i = 0; i < name1.length - 1; i++) {
                var n = name1[i]
                if (o1 && typeof o1 == "object") {
                    o1 = o1[n]
                } else {
                    return
                }
            }
            var name1 = name1[i]
        }
        if (o1 && typeof o1 == "object") {
            return [o1, name1]
        }

    }

    ww.anm.setSpriteValue = function (s, set, oa, anmobj, type, name1, name2) {
        var js = 0
        var t1 = 0
        var t2 = 0
        if (type) {
            var t1 = Math.floor(type * 0.01)
            var t2 = Math.floor(type * 0.1 - t1 * 10)
            var js = Math.floor(type % 10)
        }

        var o1 = s
        var o2 = set
        if (t1 == 2) {
            o1 = s
        } else if (t1 == 3) {
            o1 = set
        } else if (t1 == 4) {
            o1 = oa
        } else if (t1 == 5) {
            o1 = anmobj
        } else if (t1 == 6) {
            oa.value = oa.value || {}
            o1 = oa.value
        }
        if (t2 == 2) {
            o2 = s
        } else if (t2 == 3) {
            o2 = set
        } else if (t2 == 4) {
            o2 = oa
        } else if (t2 == 5) {
            o2 = anmobj
        } else if (t2 == 6) {
            oa.value = oa.value || {}
            o2 = oa.value
        }
        if (Array.isArray(name1)) {
            for (var i = 0; i < name1.length - 1; i++) {
                var n = name1[i]
                if (o1 && typeof o1 == "object") {
                    o1 = o1[n]
                } else {
                    return
                }
            }
            var name1 = name1[i]
        }
        if (Array.isArray(name2)) {
            for (var i = 0; i < name2.length - 1; i++) {
                var n = name2[i]
                if (o2 && typeof o2 == "object") {
                    o2 = o2[n]
                } else {
                    return
                }
            }
            var name2 = name2[i]
        }

        if (o1 && o2 && typeof o2 == "object" && typeof o1 == "object") {
            if (js == 0) {
                o1[name1] = o2[name2]
            } else if (js == 1) {
                o1[name1] = o1[name1] + o2[name2]
            } else if (js == 2) {
                o1[name1] = o1[name1] - o2[name2]
            } else if (js == 3) {
                o1[name1] = o1[name1] * o2[name2]
            } else if (type == 4) {
                o1[name1] = o1[name1] / o2[name2]
            } else if (js == 5) {
                o1[name1] = o1[name1] % o2[name2]
            }
        }
    }

    /**值的比较 */


    ww.anm.setEvalValue = function (time, type, value) {
        var value = value || 0
        if (type == 0) {
            return value
        } else if (type == 1) {
            return time + value
        } else if (type == 2) {
            return time - value
        } else if (type == 3) {
            return time * value
        } else if (type == 4) {
            return time / value
        } else if (type == 5) {
            return time % value
        } else if (type == 6) {
            return value + time
        } else if (type == 7) {
            return value - time
        } else if (type == 8) {
            return value * time
        } else if (type == 9) {
            return value / time
        } else if (type == 10) {
            return value % time
        }
        return 0
    }

    ww.anm.isEvalValue = function (time, type, value) {
        var value = value || 0
        if (type == 0) {
            return time == value
        } else if (type == 1) {
            return time > value
        } else if (type == 2) {
            return time >= value
        } else if (type == 3) {
            return time < value
        } else if (type == 4) {
            return time <= value
        } else if (type == 5) {
            return time != value
        } else if (type == 6) {
            return time % value == 0
        } else if (type == 7) {
            return time % value != 0
        }
        return false
    }



    /**
     * 数值初始化
     * 
     * 
     */
    ww.anm.evalini = function (s, set, n, n2, oa, anmobj) {
        if (set) {
            var v = set[n]
            var t = typeof v
            if (t == "function") {
                v(s, set, n, n2, oa, anmobj)
            } else if (v && t == "object") {
                for (var i in v) {
                    s[i] = v[i]
                }
            } else {
                if (n2) {
                    if (t == "undefind") {
                        oa.value[n2] = s[n2]
                    } else {
                        s[n2] = v
                    }
                }
            }
        }
    }


    /**
     * 
     * 计算数值返回
     * 
     * 
     * 
     */
    ww.anm.evalReturn = function (s, set, n, n2, oa, anmobj) {
        if (set) {
            var v = set[n]
            var t = typeof v
            //为数值时,判断值
            if (t == "number") {
                var z = "__" + n + n2
                oa.value[z] = oa.value[z] || 0
                oa.value[z]++
                return v >= oa.value[z]
                //没有时,永远运行
            } else if (!t) {
                //主设置没有时停止
                if (n2) {
                    return true
                } else {
                    //单个设置没有时继续
                    return false
                }
            } else if (t == "function") {
                return v(s, set, n, n2, oa, anmobj)
            } else if (t == "object") {
                //为对象时,判断值是否符合范围
                if (n2) {
                    if (Array.isArray(v)) {
                        var vz = s[n2]
                        var vil = v
                        for (var vi = 0; vi < vil.length; vi + 2) {
                            if (!ww.anm.isEvalValue(vz, vil[vi], vil[vi + 1])) {
                                return false
                            }
                        }
                    } else {
                        for (var i in v) {
                            var vz = oa.value[i]
                            var vil = v[i]
                            if (Array.isArray(vil)) {
                                for (var vi = 0; vi < vil.length; vi + 2) {
                                    if (!ww.anm.isEvalValue(vz, vil[vi], vil[vi + 1])) {
                                        return false
                                    }
                                }
                            }
                        }
                    }
                } else {
                    //为对象时,判断值是否符合范围
                    for (var i in v) {
                        if (!ww.anm.evalReturn(s, v, i, i, oa, anmobj)) {
                            return false
                        }
                        /* var vz = s[i]
                        var vil = v[i]
                        if (Array.isArray(vil)) {
                            for (var vi = 0; vi < vil.length; vi + 2) {
                                if (!ww.anm.isEvalValue(vz, vil[vi], vil[vi + 1])) {
                                    return false
                                }
                            }
                        } */
                    }
                }
                return true
            } else {
                return true
            }
        }
        return false
    }




    /**
     * 计算更新
     * 对于分设定 
     * set n 为数值时
     * 增加值
     * 为对象时  
     * 如果是数组 ,进行计算
     * 如果是对象 ,对对象名对应的值进行计算
     * 
     * 否则 赋值
     * {set:{x:{up:1}}}  // s.x + 1 
     * {up:{x:1}}  // s.x + 1 
     * 
     * 
     * 
     * 
     */
    ww.anm.evalUpdate = function (s, set, n, n2, oa, anmobj) {
        if (set) {
            var v = set[n]
            var t = typeof v
            //为数值时,判断值
            if (t == "number") {
                if (n2) {
                    s[n2] += v
                }
                //没有时,永远运行
            } else if (t == "function") {
                return v(s, set, n, n2, oa, anmobj)
            } else if (v && t == "object") {
                if (n2) {
                    if (Array.isArray(v)) {
                        var vz = s[n2]
                        var vil = v
                        for (var vi = 0; vi < vil.length; vi + 2) {
                            vz = ww.anm.setEvalValue(vz, vil[vi + 1], vil[vi])
                        }
                        s[n2] = vz

                    } else {
                        for (var i in v) {
                            var vz = oa.value[i]
                            var vil = v[i]
                            if (Array.isArray(vil)) {
                                for (var vi = 0; vi < vil.length; vi + 2) {
                                    vz = ww.anm.setEvalValue(vz, vil[vi + 1], vil[vi])
                                }
                                s[n2] = vz
                            } else {
                                var vz = vil || vz
                                if (typeof vil == "number") {
                                    s[i] += vz
                                } else {
                                    s[i] = vz
                                }
                            }
                        }

                    }
                } else {
                    //为对象时,判断值是否符合范围
                    for (var i in v) {
                        ww.anm.evalUpdate(s, v, i, i, oa, anmobj)
                        /*  var vz = s[i]
                         var vil = v[i]
                         if (Array.isArray(vil)) {
                             for (var vi = 0; vi < vil.length; vi + 2) {
                                 vz = ww.anm.setEvalValue(vz, vil[vi + 1], vil[vi])
                             }
                             s[i] = vz
                         } else {
                             if(typeof vil == "number"){
                                 s[i] = vz + vil 
                             }else{ 
                                 s[i] =  vil
                             }
                         } */
                    }
                }
            } else {
                if (n2 && t != "undefined") {
                    s[n2] = v
                }
            }
        }
    }



    ww.anm.runAnmSt = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmobj = s.__anm[name]
        var list = anmobj.list
        var index = anmobj.index
        var oa = list[index]
        if (oa) {
            oa.value = {}
            ww.anm.evalini(s, oa, "fr", "", oa, anmobj)
            if (typeof oa.set == "object") {
                for (var i in oa.set) {
                    var set = oa.set[i]
                    ww.anm.evalini(s, set, "fr", i, oa, anmobj)
                }
            }
        } else {
            s.anmClear(name)
        }
    };

    ww.anm.runAnmRun = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmobj = s.__anm[name]
        var list = anmobj.list
        var index = anmobj.index
        var oa = list[index]
        if (oa) {
            return ww.anm.evalReturn(s, oa, "t", "", oa, anmobj)
        }
        return false
    }

    ww.anm.runAnmUpdate = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmobj = s.__anm[name]
        var list = anmobj.list
        var index = anmobj.index
        var oa = list[index]
        if (oa) {
            if (!oa.d || ww.anm.evalReturn(s, oa, "d", "", oa, anmobj)) {
                ww.anm.evalUpdate(s, oa, "up", "", oa, anmobj)
                if (typeof oa.set == "object") {
                    for (var i in oa.set) {
                        var set = oa.set[i]
                        if (!set.d || ww.anm.evalReturn(s, set, "d", i, oa, anmobj)) {
                            ww.anm.evalUpdate(s, set, "up", i, oa, anmobj)
                        }
                    }
                }
            }
        }
    }



    /**动画结束 */
    ww.anm.runAnmEnd = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmobj = s.__anm[name]
        var list = anmobj.list
        var index = anmobj.index
        var oa = list[index]
        if (oa) {
            ww.anm.evalini(s, oa, "ed", "", s, oa, anmobj)
            if (typeof oa.set == "object") {
                for (var i in oa.set) {
                    var set = oa.set[i]
                    ww.anm.evalini(s, set, "ed", i, s, oa, anmobj)
                }
            }
        }
        anmobj.index++
        if (anmobj.re && list.length) {
            anmobj.index = anmobj.index % list.length
        }
        ww.anm.runAnmSt(name,s)
    };






    var Sprite_prototype_initialize = Sprite.prototype.initialize
    /**初始化 */
    Sprite.prototype.initialize = function (bitmap) {
        //精灵 初始化 呼叫(this)
        Sprite_prototype_initialize.call(this, bitmap);
        this.__anm = this.__anm || {}
    };

    var Sprite_prototype_update = Sprite.prototype.update
    /**更新 */
    Sprite.prototype.update = function () {
        //精灵 更新 呼叫(this)
        Sprite_prototype_update.call(this);
        this.updateAnm()
    };

    /**更新所有动画 */
    Sprite.prototype.updateAnm = function () {
        this.__anming = false
        for (var name in this.__anm) {
            this.__anming = true
            for (var i = this.getAnmStep(); i >= 0; i--) {
                //更新动画
                this.anmUpdate(name, this.__anm[name])
            }
        }
    };



    /**
     * 获取动画步数
     * 
     */
    Sprite.prototype.getAnmStep = function () {
        return this.__anmStep || 0
    };

    /**
     * 设置动画步数
     */
    Sprite.prototype.setAnmStep = function (i) {
        return this.__anmStep = i
    };


    /**
     * 动画播放中
     * 
     */
    Sprite.prototype.anmPlaying = function (name, c) {
        if (name) {
            if (this.__anm[name]) {
                return true
            }
        } else {
            if (this.__anming) {
                return true
            }
        }
        if (c && this.children) {
            var c = c - 1
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i] && this.children[i].anmPlaying && this.children[i].anmPlaying(name)) {
                    return true
                }
            }
        }
        return false
    }


    /**动画开始 */
    Sprite.prototype.anmSt = function (name, list, re) {
        if (!list) {
            //清除动画
            return this.anmClear(name, list)
        }
        //如果不是数组  
        var l = []

        if (Array.isArray(list)) {
            for (var i = 0; i < list.length; i++) {
                var o = ww.anm.anmToObj(list[i])
                if (o) {
                    l.push(o)
                }
            }
        } else {
            var o = ww.anm.anmToObj(list)
            if (o) {
                l.push(o)
            }
        }

        var oa = l[0]
        if (!oa) {
            return this.anmClear(name, l)
        }
        var anmobj = {
            name: name,
            index: 0,
            list: l,
            value: {},
            re: re
        }
        this.__anm = this.__anm || {}
        this.__anm[name] = anmobj
        this.__anming = true

        ww.anm.runAnmSt(name, this)
    };



    Sprite.prototype.anmAdd = function (name, list) {
        this.__anm = this.__anm || {}
        var oa = this.__anm[name]
        if (oa && oa.list.length) {
            if (list) {
                var l = []
                if (Array.isArray(list)) {
                    for (var i = 0; i < list.length; i++) {
                        var o = ww.anm.anmToObj(list[i])
                        if (o) {
                            l.push(o)
                        }
                    }
                } else {
                    var o = ww.anm.anmToObj(list)
                    if (o) {
                        l.push(o)
                    }
                }
                this.__anm[name] = oa.list.concat(l)
            }
        } else {
            this.anmSt(name, list)
        }
    };


    /**单个动画更新 */
    Sprite.prototype.anmUpdate = function (name) {
        if (ww.anm.runAnmRun(name, this)) {
            ww.anm.runAnmUpdate(name, this)
            return
        }
        this.anmEnd(name)
    }

    Sprite.prototype.anmEnd = function (name) {
        ww.anm.runAnmEnd(name, this)
    }

    /**
     * 动画清除
     */
    Sprite.prototype.anmClear = function (name, list) {
        if (name) {
            this.__anm = this.__anm || {}
            this.__anm[name] = null
            delete this.__anm[name]
        } else {
            this.__anm = {}
        }
    };


})();



(function () {


    AudioManager.playSe = function (se) {
        if (se.name) {
            this._seBuffers = this._seBuffers.filter(function (audio) {
                return audio.isPlaying();
            });
            var f2 = ($gameSwitches && $gameSwitches.value(9)) ? "" : "2"
            var buffer = this.createBuffer('se' + f2, se.name);
            this.updateSeParameters(buffer, se);
            buffer.play(false);
            this._seBuffers.push(buffer);
        }
    };

    var Scene_Map_prototype_createDisplayObjects = Scene_Map.prototype.createDisplayObjects
    Scene_Map.prototype.createDisplayObjects = function () {
        Scene_Map_prototype_createDisplayObjects.call(this)
        this.createDisplayAnim()
    };

    Scene_Map.prototype.createDisplayAnim = function () {

        var sprite = new Sprite()
        sprite.x = 0
        sprite.y = -100
        sprite.opacity = 0
        this._animBase = sprite
        this.addChild(this._animBase)
        ImageManager.loadSystem("Teller")
        ImageManager.loadSystem("Writer")
    };


    var Scene_Map_prototype_update = Scene_Map.prototype.update
    Scene_Map.prototype.update = function () {
        this.updatePeiyin()
        Scene_Map_prototype_update.call(this)
    }

    Scene_Map.prototype.updatePeiyin = function () {

        if (Input.isTriggered('menu') || TouchInput.isCancelled()) {
            var v = !$gameSwitches.value(9)
            $gameSwitches.setValue(9, v)

            if (v) {
                this._animBase.bitmap = ImageManager.loadSystem("Teller")
            } else {
                this._animBase.bitmap = ImageManager.loadSystem("Writer")
            }
            this.stPeiyinAnim()
            //this.startAnimation($da)
        }
    }

    Scene_Map.prototype.stPeiyinAnim = function () {
        this._animBase.anmSt("peiyin", [
            {
                fr: { x: -50, y: 20, opacity: 0 },
                t: 20,
                up: { y: -1, opacity: 255 / 20 },
                ed: { y: 0, opacity: 255 }
            },
            60,
            {
                t: 20,
                up: { y: -1, opacity: -255 / 20 },
                ed: { y: -20, opacity: 0 }
            }])
    }



})()