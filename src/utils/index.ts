
class BrowserDetector {
    public is_opera: boolean;
    public is_firefox: boolean;
    public is_safari: boolean;
    public is_chrome: boolean;
    public is_blink: boolean;
    public is_mac: boolean;
    public is_win: boolean;
    public is_ios: boolean;
    public is_android: boolean;
    public is_mobile: boolean;

    constructor() {
        // Opera 8.0+
        this.is_opera = (
            // @ts-ignore
            (!!window.opr && !!opr.addons) // eslint-disable-line no-undef
            // @ts-ignore
            || !!window.opera
            || (navigator.userAgent.indexOf(" OPR/") >= 0)
        );

        // Firefox 1.0+
        // @ts-ignore
        this.is_firefox = (typeof mozInnerScreenX !== "undefined");

        // Safari 3.0+ "[object HTMLElementConstructor]"
        this.is_safari = (function () {
            if (/constructor/i.test(String(window["HTMLElement"]))) {
                return true;
            }
            let push: any;
            try {
                push = window.top["safari"].pushNotification;
            } catch {
                try {
                    push = window["safari"].pushNotification;
                } catch {
                    return false;
                }
            }
            return String(push) === "[object SafariRemoteNotification]";
        })();

        // Chrome 1+
        // @ts-ignore
        this.is_chrome = !!window.chrome;

        // Blink engine detection
        this.is_blink = ((this.is_chrome || this.is_opera) && !!window.CSS);

        // Any browser on Mac
        this.is_mac = ((
            // @ts-ignore
            window.navigator.oscpu
            || window.navigator.platform
            || window.navigator.appVersion
            || "Unknown"
        ).indexOf("Mac") !== -1);

        // Any Windows
        this.is_win = (navigator && !!(/win/i).exec(navigator.platform));

        // iOS browsers
        this.is_ios = (!!navigator.platform && (
            /iPad|iPhone|iPod/.test(navigator.platform)
            || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && !window["MSStream"])
        ));

        this.is_android = /android/i.test(navigator.userAgent);

        this.is_mobile = (this.is_ios || this.is_android);

        console.log("===== BB flags:", this.getFlags());
    }

    public getFlags(): { [key: string]: boolean } {
        return {
            "is_opera": this.is_opera,
            "is_firefox": this.is_firefox,
            "is_safari": this.is_safari,
            "is_chrome": this.is_chrome,
            "is_blink": this.is_blink,
            "is_mac": this.is_mac,
            "is_win": this.is_win,
            "is_ios": this.is_ios,
            "is_android": this.is_android,
            "is_mobile": this.is_mobile,
        };
    }
}

// 使用示例
export const browser = new BrowserDetector();

export const cookies = {
    get(name: string) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)" // eslint-disable-line no-useless-escape
        ));
        return (matches ? decodeURIComponent(matches[1]) : "");
    },
};

export const storage = {
    "get": function (key, default_value) {
        let value = window.localStorage.getItem(key);
        return (value !== null ? value : `${default_value}`);
    },
    set(key, value) {
        window.localStorage.setItem(key, value)
    },

    getInt(key, default_value) {

        parseInt(this.get(key, default_value))
    },
    setInt(key, value) {

        this.set(key, value)
    },

    getBool(key, default_value) {

        !!parseInt(this.get(key, (default_value ? "1" : "0")))
    },
    setBool(key, value) {

        this.set(key, (value ? "1" : "0"))
    },

    bindSimpleSwitch(el, key, default_value, callback = null) {
        let value = this.getBool(key, default_value);
        el.checked = value;
        if (callback) {
            callback(value);
        }
        // this.el.setOnClick(el, () => {
        //     if (callback) {
        //         callback(el.checked);
        //     }
        //     this.setBool(key, el.checked);
        // }, false);
    },
}

export const tools = {
    setDefault(dict, key, value) {
        if (!(key in dict)) {
            dict[key] = value;
        }
    },
    info(...args) {
        console.log(...args);
    }
}


// export const browser = new function () {
//     // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769
//     // https://github.com/fingerprintjs/fingerprintjs/discussions/641

//     // Opera 8.0+
//     let is_opera = (
//         (!!window.opr && !!opr.addons) // eslint-disable-line no-undef
//         || !!window.opera
//         || (navigator.userAgent.indexOf(" OPR/") >= 0)
//     );

//     // Firefox 1.0+
//     let is_firefox = (typeof mozInnerScreenX !== "undefined");

//     // Safari 3.0+ "[object HTMLElementConstructor]"
//     let is_safari = (function () {
//         if (/constructor/i.test(String(window["HTMLElement"]))) {
//             return true;
//         }
//         let push = null;
//         try {
//             push = window.top["safari"].pushNotification;
//         } catch {
//             try {
//                 push = window["safari"].pushNotification;
//             } catch {
//                 return false;
//             }
//         }
//         return String(push) === "[object SafariRemoteNotification]";
//     })();

//     // Chrome 1+
//     let is_chrome = !!window.chrome;

//     // Blink engine detection
//     let is_blink = ((is_chrome || is_opera) && !!window.CSS);

//     // Any browser on Mac
//     let is_mac = ((
//         window.navigator.oscpu
//         || window.navigator.platform
//         || window.navigator.appVersion
//         || "Unknown"
//     ).indexOf("Mac") !== -1);

//     // Any Windows
//     let is_win = (navigator && !!(/win/i).exec(navigator.platform));

//     // iOS browsers
//     // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
//     // https://github.com/lancedikson/bowser/issues/329
//     let is_ios = (!!navigator.platform && (
//         /iPad|iPhone|iPod/.test(navigator.platform)
//         || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && !window["MSStream"])
//     ));

//     let is_android = /android/i.test(navigator.userAgent);

//     let flags = {
//         "is_opera": is_opera,
//         "is_firefox": is_firefox,
//         "is_safari": is_safari,
//         "is_chrome": is_chrome,
//         "is_blink": is_blink,
//         "is_mac": is_mac,
//         "is_win": is_win,
//         "is_ios": is_ios,
//         "is_android": is_android,
//         "is_mobile": (is_ios || is_android),
//     };

//     console.log("===== BB flags:", flags);
//     return flags;
// };