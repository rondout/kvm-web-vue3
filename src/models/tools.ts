/*
 * @Author: shufei.han
 * @Date: 2024-10-16 15:45:48
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 15:49:30
 * @FilePath: \kvm-web-vue3\src\models\tools.ts
 * @Description: 
 */
export const checkBrowser = function () {
    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769
    // https://github.com/fingerprintjs/fingerprintjs/discussions/641

    // Opera 8.0+
    let is_opera = (
        // @ts-ignore
        (!!window.opr && !!opr.addons) // eslint-disable-line no-undef
        // @ts-ignore
        || !!window.opera
        || (navigator.userAgent.indexOf(" OPR/") >= 0)
    );

    // Firefox 1.0+
        // @ts-ignore
    let is_firefox = (typeof mozInnerScreenX !== "undefined");

    // Safari 3.0+ "[object HTMLElementConstructor]"
    let is_safari = (function () {
        if (/constructor/i.test(String(window["HTMLElement"]))) {
            return true;
        }
        let push = null;
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
    let is_chrome = !!window.chrome;

    // Blink engine detection
    let is_blink = ((is_chrome || is_opera) && !!window.CSS);

    // Any browser on Mac
    let is_mac = ((
        // @ts-ignore
        window.navigator.oscpu
        || window.navigator.platform
        || window.navigator.appVersion
        || "Unknown"
    ).indexOf("Mac") !== -1);

    // Any Windows
    let is_win = (navigator && !!(/win/i).exec(navigator.platform));

    // iOS browsers
    // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    // https://github.com/lancedikson/bowser/issues/329
    let is_ios = (!!navigator.platform && (
        /iPad|iPhone|iPod/.test(navigator.platform)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && !window["MSStream"])
    ));

    let is_android = /android/i.test(navigator.userAgent);

    let flags = {
        "is_opera": is_opera,
        "is_firefox": is_firefox,
        "is_safari": is_safari,
        "is_chrome": is_chrome,
        "is_blink": is_blink,
        "is_mac": is_mac,
        "is_win": is_win,
        "is_ios": is_ios,
        "is_android": is_android,
        "is_mobile": (is_ios || is_android),
    };

    console.log("===== BB flags:", flags);
    return flags;
};

export const browserTool = checkBrowser()