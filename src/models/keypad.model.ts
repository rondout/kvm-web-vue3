/*
 * @Author: shufei.han
 * @Date: 2024-11-22 18:05:22
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-22 18:35:09
 * @FilePath: \kvm-web-vue3\src\models\keypad.model.ts
 * @Description: 
 */
import { browser, tools } from "@/utils";

export class Keypad {
    public merged = {};
    public keys = {};
    public modifiers = {};

    public fix_mac_cmd = false;
    public fix_win_altgr = false;
    public altgr_ctrl_timer = null;

    constructor(public keys_parent, public sendKey, public apply_fixes) {
        this.init()
    }

    private init() {
        if (this.apply_fixes) {
            this.fix_mac_cmd = browser.is_mac;
            if (this.fix_mac_cmd) {
                tools.info(`Keymap at ${this.keys_parent}: enabled Fix-Mac-CMD`);
            }
            this.fix_win_altgr = browser.is_win;
            if (this.fix_win_altgr) {
                tools.info(`Keymap at ${this.keys_parent}: enabled Fix-Win-AltGr`);
            }
        }

        // for (let el_key of $$$(`${__keys_parent} div.key`)) {
        //     let code = el_key.getAttribute("data-code");

        //     tools.setDefault(__keys, code, []);
        //     __keys[code].push(el_key);

        //     tools.setDefault(__merged, code, []);
        //     __merged[code].push(el_key);

        //     tools.el.setOnDown(el_key, () => __clickHandler(el_key, true));
        //     tools.el.setOnUp(el_key, () => __clickHandler(el_key, false));
        //     el_key.onmouseout = function () {
        //         if (__isPressed(el_key)) {
        //             __clickHandler(el_key, false);
        //         }
        //     };
        // }

        // for (let el_key of $$$(`${__keys_parent} div.modifier`)) {
        //     let code = el_key.getAttribute("data-code");

        //     tools.setDefault(__modifiers, code, []);
        //     __modifiers[code].push(el_key);

        //     tools.setDefault(__merged, code, []);
        //     __merged[code].push(el_key);

        //     tools.el.setOnDown(el_key, () => __toggleModifierHandler(el_key));
        // }
    }

}