var EventEmitter = window.EventEmitter;
var emitter = new EventEmitter();
class SocketClient {
    constructor(config, o) {
        var self = this;
        this.retry = 0;
        this.screen = {};
        // this.screen = {
        //     id: config.group.id,
        //     name: config.group.cnName,
        //     group: config.group.enName,
        //     mode: config.mode || "",
        //     heartCheck: config.heartCheck
        // };
        Object.assign(this.screen, config);
        this.isReady = false;
        //离线版本版本服务地址
        //this.server = 'ws://192.168.1.1:8080/broadcast/';
        //线上版本
        this.server = `ws://${config.ip}:${config.port}/datav/`;
		console.log(this.server)
        //this.server = 'ws://service.datav.aliyun.com/broadcast/'
        this.broadcast = {
            emit: function(event, data, cb) {
                self.send({
                    event: "broadcast",
                    data: {
                        event: event,
                        data: data
                    }
                }, cb);
            },
            on: function(event, cb) {
                emitter.on("broadcast_" + event, cb);
            }
        };
        //心跳检测
        this.heartCheck = {
            timeout: this.screen.heartCheck.timer || 3000, //每隔三秒发送心跳
            //num: 3, //3次心跳均未响应重连
            timeoutObj: null,
            serverTimeoutObj: null,
            start: function() {
                var _this = this;
                var _num = this.num;
                this.timeoutObj && clearTimeout(this.timeoutObj);
                this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);

                this.timeoutObj = setTimeout(function() {
                    //onmessage拿到返回的心跳就说明连接正常
                    self.ws.onopen = function(){
						self.ws.send(JSON.stringify({
						    "event": "heartCheck",
						    //"data": "120",
						    "timestamp": new Date().toLocaleTimeString()
						})); // 心跳包
					}
                }, this.timeout);
                // const status = o.getCache("screen-heart-check");
                // if (status == 1) {}
            }
        }

        this.connection = function() {
            var self = this;
            setTimeout(function() {
                var ws = new WebSocket(self.server, 'echo-protocol');
                self.retry++;
                ws.onclose = function() {
                    o.log("通迅服务重建连接...", "warn");
                    // 重新连接
                    self.connection();
                };
                ws.onopen = function() {
                    self.retry = 0;
                    o.log('通迅服务连接成功', 'success');
                    self.registScreen(self.screen, function(err, data) {
                        console.log(":::::", err);
                        if (err) {
                            return console.error(err);
                        }
                        o.log('通迅服务注册成功', 'success');
                        self.ready(true);
                    });

                    if (self.screen.heartCheck.open) { // 保持全局只开启一个心跳服务,降低无效服务
                        self.heartCheck.start();

                    }
                };
                ws.onmessage = function(evt) {
                    o.log("消息", evt, JSON.stringify(evt.data));
                    var evt = JSON.parse(evt.data);
                    if (evt && evt.event) {
                        switch (evt.event) {
                            case "broadcast":
                                emitter.emit("broadcast_" + evt.data.event, evt.data.data);
                                break;
                            case "heartCheck":
                                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                                // 本次连接是否允许打开心跳检测重置，多端连接全局只允许一个发送端
                                o.log(`心跳检测正常:${new Date().toLocaleTimeString()}`);

                                if (self.screen.heartCheck.open) {
                                    //心跳检测重置
                                    self.heartCheck.start();
                                }
                                break;
                            default:
                                emitter.emit(evt.event, evt.data);
                                break;
                        }
                    }
                };
                self.ws = ws;
            }, this.retry * 1000);
        };
        this.setCallback = function(id, cb) {
            // 注册一个单次监听器
            emitter.once(id, function(data) {
                if (data.isError) {
                    cb(data.data);
                } else {
                    cb(null, data.data);
                }
            })
        };
        this.registScreen = function(screen, cb) {
            this.send(Object.assign({
                event: "register",
                data: {
                    sid: screen.id,
                    name: screen.name,
                    group: screen.group || '默认分组'
                }
            }, (!!config.mode ? {
                mode: "hook"
            } : {})), cb);
        };
        this.send = function(data, cb) {
            //console.log(data);
            if (cb) {
                var callbackId = 'callback_' + (new Date().getTime()) + ("" + Math.random()).replace('0.', '');
                this.setCallback(data.event, cb); //callbackId
                data.callback = callbackId;
            }
            this.ws.send(JSON.stringify(Object.assign(data, (!!config.mode ? {
                mode: "hook"
            } : {}))));
        };
        this.emit = function(event, data, cb) {
            this.broadcast.emit(event, data, cb);
        };
        this.on = function(event, cb) {
            this.broadcast.on(event, cb);
        };
        this.ready = function(state) {
            //console.log("状态", typeof state, typeof this.isState);
            if (typeof state === 'function') {
                if (!this.isState) {
                    emitter.once('ready', state);
                } else {
                    state();
                    console.log("执行")
                }
            } else if (state) {
                this.isReady = true;
                emitter.emit('ready');
            } else {
                this.isReady = false;
            }
        };
        this.connection();
        return this;
    };
}
class Comm {
    constructor() {
        const self = this;
        // 全局配置


        // id: config.group.id,
        // name: config.group.cnName,
        // group: config.group.enName,
        // mode: config.mode || "",
        // heartCheck: config.heartCheck

        this.setting = {
            // 服务端
            server: {
                ip: "127.0.0.1"
            },
            socket: { // socket相关配置
                ip: "10.142.124.224", // socket服务地址
				// ip: "192.168.1.18", // socket服务地址
				// ip: "192.168.31.131", // socket服务地址
                port: "8689", // socket服务端口
                id: 506055, // 频道编号
                group: 'huanzhou-sunxun-hsj', // 频道英文名
                name: '杭州海事可视化大屏', // 频道组中文名
                // group: { // 频道组信息
                //     id: 506055, // 频道编号
                //     cnName: '杭州海事可视化大屏', // 频道组中文名
                //     enName: 'huanzhou-sunxun-hsj' // 频道英文名
                // },
                mode: "hook",
                heartCheck: { // 是否具带心跳服务
                    open: false,
                    timer: 5000
                }
            },

            // 是否关闭所有控制端信息
            log: true
        };
        this.screen = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
        // 缓存配置
        this.cache = {
            // 场景
            scene: {
                current: "",
                prev: ""
            },
            dialog: []
        };
        // 控制台打印配色方案
        this.theme = {
            content: [
                'font-size：12px',
                'color:#000'
            ],
            success: [
                'font-size:12px',
                'color:#fff',
                'background:#00c200',
                'font-weight:bolder',
                'border-radius:3px',
                'padding:2px'
            ],
            info: [
                'font-size:12px',
                'color:#fff',
                'background:#00aa7f',
                'font-weight:bolder',
                'border-radius:3px',
                'padding:2px'
            ],
            warn: [
                'font-size:12px',
                'color:#fff',
                'font-weight:bolder',
                'background:#e79a00',
                'border-radius:3px',
                'padding:2px'
            ],
            error: [
                'font-size:12px',
                'color:#fff',
                'font-weight:bolder',
                'background:#e30000',
                'border-radius:3px',
                'padding:2px'
            ]
        }

        $(window).resize(function() {
            self.screen = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        });
    };
    /**
     * 获取缓存值
     * @param {*} key 缓存键值
     * @returns 
     */
    getCache(key) {
        var value = localStorage.getItem(key);
        return value;
        // if (value) {
        //     return 
        //     // try {
        //     //     var value_json = JSON.parse(value);
        //     //     if (typeof value_json === 'object') {
        //     //         return value_json;
        //     //     } else if (typeof value_json === 'number') {
        //     //         return value_json;
        //     //     }
        //     // } catch (e) {
        //     //     return value;
        //     // }
        // } else {
        //     return false;
        // }
    };
    /**
     * 设置缓存值
     * @param {*} key 缓存键值
     * @param {*} value 缓存值
     */
    setCache(key, value) {
        localStorage.setItem(key, value);
    };
    /**
     * 移除缓存值
     * @param {*} key 缓存键值
     * @returns 
     */
    removeCache(key) {
        localStorage.removeItem(key);
    };
    /**
     * 控制台打印
     * @param {*} msg 打印消息
     * @param {*} type 日志类型或者 对象
     */
    log(msg, type) {
        //%o%O
        if (Object.prototype.toString.call(type) == '[object Object]') {
            console.log('%c VISIX %c %s %o', this.theme.info.join(';'), this.theme.content.join(';'), msg, type);
        } else {
            const t = this.theme[!type ? 'info' : type];
            if (t && this.setting.log) {
                console.log('%c VISIX %c %s', t.join(';'), this.theme.content.join(';'), msg);
            }
        }
    };
    /**
     * 修改心跳服务的开关状态
     * @status {*} 开关状态 true:开,false:关
     */
    toggleHeartCheck(status) {
        this.log(`通迅心跳检测已${status?'开启':'关闭'}`, "warn");
        this.setCache("screen-heart-check", status ? 1 : 0);
        //this.heartCheck;
        this.utils.broadcast.heartCheck.start();
        // console.log(this);
        // status ? this.heartCheck.start() : this.heartCheck.stop();
        // this.setting.heartCheck.open = status;
    };
    /**
     * 切换地图图层的显隐
     * @param {*} comps 地图图层集
     * @param {*} status 显隐状态 true:显示，false:隐藏
     * @param {*} fn 回调
     */
    toggleMapComponent(comps, status, fn) {
        if (Array.isArray(comps)) {
            comps.forEach(v => {
                const t = this.Com(v);
                if (t) {
                    // this.log(`${v}:${status}`)
                    t[status ? 'show' : 'hide']();
                }
            })
        }
        fn && fn.call(this)
    };
    /**
     * 获取组件对象
     * @param {*} name 组件名称
     * @param {*} debug 是否打印组件实例
     * @returns 组件实例对象
     */
    Com(name, debug) {
        if (!!this.utils && !!this.utils.G) {
            const com = this.utils.G(this.components[name]);
            if (debug) {
                if (com) {
                    this.log(`${name}`, com);
                } else {
                    this.log(`${name}不存在`, "error")
                }
            }
            return com;
        } else {
            this.log(`this.utils对象未挂载`, "error");
            return null;
        }
    };
    /**
     * 获取组件Dom对象
     * @param {*} name 组件名称
     * @param {*} debug 是否打印组件实例
     * @returns 组件Dom对象
     */
    Dom(name, debug) {
        const com = this.Com(name, debug);
        if (com) {
            return com.container;
        }
        return null;
    };
    /**
     * 创建socket通迅端
     * @param {*} socket 通迅配置 
     * @param {*} opt {
                        mscreen: false, // 注册mscreen服务
                        hook: true // 创建Hook服务
						heartCheck:false  // 是否开启心跳服务
                      } 
     */
    createSocket(socket, opt = {
        mscreen: false,
        hook: true,
        heartCheck: false
    }) {
        return new Promise((resolve, reject) => {
            if (!!this.utils) {
                // client to mscreen
                if (opt.mscreen) {
                    // this.utils.loadScriptByUrl(`http://${socket.ip}:3200/socket.js`).then(() => {
						this.utils.loadScriptByUrl(`http://198.16.4.80:3200/socket.js`).then(() => {
						
                        if (window.io) {
                            // this.utils.socket = io(`http://${socket.ip}:3010`);
							this.utils.socket = io(`http://198.16.4.80:3010`);
                        } else {
                            this.log(`mscreen服务文件未加载`, "error");
                        }
                    });
                }
                // page client to page client
                // this.utils.broadcast = new this.socket(socket);
                if (opt.hook) {
                    this.utils.broadcast = new SocketClient(socket, this);
                }
                resolve(true);
            } else {
                this.log(`this.utils对象未挂载`, "error");
                resolve(false);
            }
        })
    };
    /**
     * 向mscreen平台输送一条指令
     * @param {*} action 扩播频道
     * @param {*} data  扩播数据
     */
    sendMsgToMscreen(action, data) {
        this.utils.socket && this.utils.socket.emit(action, data);
    };
    /**
     * 广播一条信息
     * @param {*} action 扩播频道
     * @param {*} data  扩播数据
     */
    broadcastMsg(action, data) {
        this.utils.broadcast && this.utils.broadcast.emit(action, data);
    };
    /**
     * 监听广播
     * @param {Object} action 扩播频道
     * @param {Object} cb 回调函数
     */
    broadcastListen(action, cb) {
            this.utils.broadcast && this.utils.broadcast.on(action, cb);
        }
        // coordtransform: {bd09togcj02: ƒ, gcj02tobd09: ƒ, wgs84togcj02: ƒ, gcj02towgs84
        /**
         * 84转gcj2000
         * @param {*} lnglats [{lng:111,lat:2222},......] 
         */
    coordtransform(lng, lat) {
        const t = this.utils.coordtransform.wgs84togcj02;
        const temp = t(lng, lat)
        return {
            lng: temp[0] * 1,
            lat: temp[1] * 1
        }
    };
    /**
     * 84转gcj2000
     * @param {*} lnglats [{lng:111,lat:2222},......] 
     */
    coordtransformList(lnglats, keyMap = {
        lng: "lng",
        lat: "lat"
    }) {
        var result = [];
        if (Object.prototype.toString.call(lnglats) == '[object Array]') {
            const t = this.utils.coordtransform.wgs84togcj02;
            result = lnglats.map(v => {
                const temp = t(v[keyMap.lng], v[keyMap.lat])
                return Object.assign(v, {
                    lng: temp[0] * 1,
                    lat: temp[1] * 1
                })
            })
        }
        return result;
    };
    /**
     * 切换组件/图层显隐操作
     * @param {*} el 组件ID
     * @param {*} status true:显示,false:隐藏
     * @param {*} opt1 显示配置信息
     * @param {*} opt2 隐藏配置信息
     * @returns 
     */
    toggleComponentShow(el, status, cache = false, opt1, opt2) {
        return new Promise((resolve, reject) => {
            const dom = this.Dom(el);
            if (!dom) {
                this.log(`无法获取${el}组件或图层`, "error");
                resolve(false);
                return false;
            }
            if (this.animation) {
                if (status) { // 显示
                    if (cache) {
                        this.cache.dialog.push(el);
                    }
                    this.animation.tweenMax.fromTo(dom, 2, {
                        css: Object.assign({
                            opacity: 0,
                            x: (this.screen.width / 2) - (dom.clientWidth / 2),
                            y: (this.screen.height / 2) - (dom.clientHeight / 2),
                            scale: 0.9,
                            'z-index': 0
                        }, opt1 || {}),
                        ease: Expo.easeNone
                    }, {
                        delay: 0.1,
                        css: {
                            opacity: 1,
                            scale: 1,
                            ...opt2,
                            'z-index': 0
                        },
                        ease: Expo.Linear
                    });
                    resolve(true);
                } else {
                    this.animation.tweenMax.to(dom, 1, {
                        css: {
                            opacity: 0,
                            scale: 0.9,
                            'z-index': -10
                        },
                        ease: Expo.easeOut
                    });
                    resolve(true);
                }
            } else {
                this.log(`this.animation动画库未挂载`, "error");
                resolve(false);
            }
        })
    };
}