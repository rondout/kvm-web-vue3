/*
 * @Author: shufei.han
 * @Date: 2024-11-21 14:43:06
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 14:22:10
 * @FilePath: \kvm-web-vue3\src\models\session.model.ts
 * @Description: 
 */
import { WebSocketService } from "@/api/websocket"
import { $ } from "./janus.model";

// @ts-ignore
const __ascii_encoder = new TextEncoder("ascii");

export class Session {
    public ws: WebSocket
    public missed_heartbeats = 0
    // public streamer = new Streamer()
    constructor() {
        this.startSession()
    }

    private startSession() {
        const ws = new WebSocketService('/api/ws').socket
        ws.sendHidedEvent = (event) => this.__sendHidEvent(event.event_type, event.event)
        ws.onopen = this.wsOpenHandler
        ws.onmessage = this.wsMessageHandler
        this.ws = ws
    }

    private __sendHidEvent(event_type, event) {
        const { ws } = this
        if (event_type == "key") {
            let data = __ascii_encoder.encode("\x01\x00" + event.key);
            data[1] = (event.state ? 1 : 0);
            ws.send(data);

        } else if (event_type == "mouse_button") {
            let data = __ascii_encoder.encode("\x02\x00" + event.button);
            data[1] = (event.state ? 1 : 0);
            ws.send(data);

        } else if (event_type == "mouse_move") {
            let data = new Uint8Array([
                3,
                (event.to.x >> 8) & 0xFF, event.to.x & 0xFF,
                (event.to.y >> 8) & 0xFF, event.to.y & 0xFF,
            ]);
            ws.send(data);

        } else if (event_type == "mouse_relative" || event_type == "mouse_wheel") {
            let data;
            if (Array.isArray(event.delta)) {
                data = new Int8Array(2 + event.delta.length * 2);
                let index = 0;
                for (let delta of event.delta) {
                    data[index + 2] = delta["x"];
                    data[index + 3] = delta["y"];
                    index += 2;
                }
            } else {
                data = new Int8Array([0, 0, event.delta.x, event.delta.y]);
            }
            data[0] = (event_type == "mouse_relative" ? 4 : 5);
            data[1] = (event.squash ? 1 : 0);
            ws.send(data);
        }
    }

    private wsMessageHandler(event) {
        // tools.debug("Session: received socket data:", event.data);
        let data = JSON.parse(event.data);
        switch (data.event_type) {
            case "pong": this.missed_heartbeats = 0; break;
            case "info_meta_state": this.setAboutInfoMeta(data.event); break;
            case "info_hw_state": this.setAboutInfoHw(data.event); break;
            case "info_fan_state": this.setAboutInfoFan(data.event); break;
            case "info_system_state": this.setAboutInfoSystem(data.event); break;
            case "info_extras_state": this.setExtras(data.event); break;
            // 这两种是GPIO消息，先不处理，后续搞清楚了再处理
            // case "gpio_model_state": this.gpio.setModel(data.event); break;
            // case "gpio_state": this.gpio.setState(data.event); break;
            // case "hid_keymaps_state": this.hid.setKeymaps(data.event); break;
            // case "hid_state": this.hid.setState(data.event); break;
            // case "atx_state": this.atx.setState(data.event); break;
            // case "msd_state": this.msd.setState(data.event); break;
            case "streamer_state": this.streamer.setState(data.event); break;
            // case "streamer_ocr_state": this.ocr.setState(data.event); break;
        }
    }

    private wsOpenHandler(event) {
        console.log('WS_ON_OPEN');

        // tools.debug("Session: socket opened:", event);
        // $("link-led").className = "led-green";
        // $("link-led").title = "Connected";
        // __recorder.setSocket(__ws);
        // __hid.setSocket(__ws);
        // __missed_heartbeats = 0;
        // __ping_timer = setInterval(__pingServer, 1000);
    }

    private setAboutInfoMeta(state) {
        if (state !== null) {
            let text = JSON.stringify(state, undefined, 4).replace(/ /g, "&nbsp;").replace(/\n/g, "<br>");
            $("about-meta").innerHTML = `
				<span class="code-comment">// The PiKVM metadata.<br>
				// You can get this JSON using handle <a target="_blank" href="/api/info?fields=meta">/api/info?fields=meta</a>.<br>
				// In the standard configuration this data<br>
				// is specified in the file /etc/kvmd/meta.yaml.</span><br>
				<br>
				${text}
			`;
            if (state.server && state.server.host) {
                $("kvmd-meta-server-host").innerHTML = `Server: ${state.server.host}`;
                document.title = `PiKVM Session: ${state.server.host}`;
            } else {
                $("kvmd-meta-server-host").innerHTML = "";
                document.title = "PiKVM Session";
            }

            // Don't use this option, it may be removed in any time
            if (state.web && state.web.confirm_session_exit === false) {
                window.onbeforeunload = null; // See main.js
            }
        }
    }

    private setAboutInfoHw(state) {
        // if (state.health.throttling !== null) {
        // 	let flags = state.health.throttling.parsed_flags;
        // 	let ignore_past = state.health.throttling.ignore_past;
        // 	let undervoltage = (flags.undervoltage.now || (flags.undervoltage.past && !ignore_past));
        // 	let freq_capped = (flags.freq_capped.now || (flags.freq_capped.past && !ignore_past));

        // 	tools.hidden.setVisible($("hw-health-dropdown"), (undervoltage || freq_capped));
        // 	$("hw-health-undervoltage-led").className = (undervoltage ? (flags.undervoltage.now ? "led-red" : "led-yellow") : "hidden");
        // 	$("hw-health-overheating-led").className = (freq_capped ? (flags.freq_capped.now ? "led-red" : "led-yellow") : "hidden");
        // 	tools.hidden.setVisible($("hw-health-message-undervoltage"), undervoltage);
        // 	tools.hidden.setVisible($("hw-health-message-overheating"), freq_capped);
        // }
        // __info_hw_state = state;
        // __renderAboutInfoHardware();
    };

    private setAboutInfoFan(state) {
        let failed = false;
        let failed_past = false;
        if (state.monitored) {
            if (state.state === null) {
                failed = true;
            } else {
                if (!state.state.fan.ok) {
                    failed = true;
                } else if (state.state.fan.last_fail_ts >= 0) {
                    failed = true;
                    failed_past = true;
                }
            }
        }
        // tools.hidden.setVisible($("fan-health-dropdown"), failed);
        // $("fan-health-led").className = (failed ? (failed_past ? "led-yellow" : "led-red") : "hidden");

        // __info_fan_state = state;
        // __renderAboutInfoHardware();
    };

    private setAboutInfoSystem = function (state) {
        console.log('setAboutInfoSystem', state);
        // $("about-version").innerHTML = `
        // 	KVMD: <span class="code-comment">${state.kvmd.version}</span><br>
        // 	<hr>
        // 	Streamer: <span class="code-comment">${state.streamer.version} (${state.streamer.app})</span>
        // 	${__formatStreamerFeatures(state.streamer.features)}
        // 	<hr>
        // 	${state.kernel.system} kernel:
        // 	${__formatUname(state.kernel)}
        // `;
        // $("kvmd-version-kvmd").innerHTML = state.kvmd.version;
        // $("kvmd-version-streamer").innerHTML = state.streamer.version;
    }

    private setExtras(state) {
        // let show_hook = null;
        // let close_hook = null;
        // let has_webterm = (state.webterm && (state.webterm.enabled || state.webterm.started));
        // if (has_webterm) {
        // 	let path = "/" + state.webterm.path + "?disableLeaveAlert=true";
        // 	show_hook = function() {
        // 		tools.info("Terminal opened: ", path);
        // 		$("webterm-iframe").src = path;
        // 	};
        // 	close_hook = function() {
        // 		tools.info("Terminal closed");
        // 		$("webterm-iframe").src = "";
        // 	};
        // }
        // tools.feature.setEnabled($("system-tool-webterm"), has_webterm);
        // $("webterm-window").show_hook = show_hook;
        // $("webterm-window").close_hook = close_hook;
        // console.log("SET_JANUS_ENABLED: ", state);
        // __streamer.setJanusEnabled(
        // 	(state.janus && (state.janus.enabled || state.janus.started))
        // 	|| (state.janus_static && (state.janus_static.enabled || state.janus_static.started))
        // );
    }
}

export function sendHidEvent(ws, { event_type, event }) {
    if (event_type == "key") {
        let data = __ascii_encoder.encode("\x01\x00" + event.key);
        data[1] = (event.state ? 1 : 0);
        ws.send(data);
        console.log(data, {event_type, event});
        

    } else if (event_type == "mouse_button") {
        let data = __ascii_encoder.encode("\x02\x00" + event.button);
        data[1] = (event.state ? 1 : 0);
        ws.send(data);

    } else if (event_type == "mouse_move") {
        let data = new Uint8Array([
            3,
            (event.to.x >> 8) & 0xFF, event.to.x & 0xFF,
            (event.to.y >> 8) & 0xFF, event.to.y & 0xFF,
        ]);
        ws.send(data);

    } else if (event_type == "mouse_relative" || event_type == "mouse_wheel") {
        let data;
        if (Array.isArray(event.delta)) {
            data = new Int8Array(2 + event.delta.length * 2);
            let index = 0;
            for (let delta of event.delta) {
                data[index + 2] = delta["x"];
                data[index + 3] = delta["y"];
                index += 2;
            }
        } else {
            data = new Int8Array([0, 0, event.delta.x, event.delta.y]);
        }
        data[0] = (event_type == "mouse_relative" ? 4 : 5);
        data[1] = (event.squash ? 1 : 0);
        ws.send(data);
    }
}

export function remap(x, a1, b1, a2, b2) {
    let remapped = Math.round((x - a1) / b1 * (b2 - a2) + a2);
    if (remapped < a2) {
        return a2;
    } else if (remapped > b2) {
        return b2;
    }
    return remapped;
}

export function getResolution () {
    let el = $("stream-video");
    return {
        // Разрешение видео или элемента
        "real_width": (el.videoWidth || el.offsetWidth),
        "real_height": (el.videoHeight || el.offsetHeight),
        "view_width": el.offsetWidth,
        "view_height": el.offsetHeight,
    };
}

export function getGeometry () {
    let res = getResolution();
    let ratio = Math.min(res.view_width / res.real_width, res.view_height / res.real_height);
    return {
        "x": Math.round((res.view_width - ratio * res.real_width) / 2),
        "y": Math.round((res.view_height - ratio * res.real_height) / 2),
        "width": Math.round(ratio * res.real_width),
        "height": Math.round(ratio * res.real_height),
        "real_width": res.real_width,
        "real_height": res.real_height,
    };
}