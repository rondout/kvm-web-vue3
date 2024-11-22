import { storage } from "@/utils";
import { $, JanusStreamer } from "./janus.model";
import { MjpegStreamer } from "./mjpegStreamer";

export class Streamer {
    public __janus_enabled = null;
    public __streamer = null;

    public __state = null;
    public __resolution = { "width": 640, "height": 480 };

    constructor() {
        this.init()
    }

    private __setActive() {
        $("stream-led").className = "led-green";
        $("stream-led").title = "Stream is active";
    };

    private __setInactive() {
        $("stream-led").className = "led-gray";
        $("stream-led").title = "Stream inactive";
    };

    private __setInfo(is_active, online, text) {
        $("stream-box").classList.toggle("stream-box-offline", !online);
        let el_grab = document.querySelector("#stream-window-header .window-grab");
        let el_info = $("stream-info");
        let title = `${this.__streamer.getName()} &ndash; `;
        if (is_active) {
            if (!online) {
                title += "No signal / ";
            }
            title += this.__makeStringResolution(this.__resolution);
            if (text.length > 0) {
                title += " / " + text;
            }
        } else {
            if (text.length > 0) {
                title += text;
            } else {
                title += "Inactive";
            }
        }
        el_grab.innerHTML = el_info.innerHTML = title;
    };

    private __makeStringResolution = function (resolution) {
        return `${resolution.width}x${resolution.height}`;
    }

    private init() {
        this.__streamer = new MjpegStreamer(this.__setActive, this.__setInactive, this.__setInfo);

        $("stream-led").title = "Stream inactive";

        // tools.slider.setParams($("stream-quality-slider"), 5, 100, 5, 80, function (value) {
        //     $("stream-quality-value").innerHTML = `${value}%`;
        // });
        // tools.slider.setOnUpDelayed($("stream-quality-slider"), 1000, (value) => __sendParam("quality", value));

        // tools.slider.setParams($("stream-h264-bitrate-slider"), 25, 20000, 25, 5000, function (value) {
        //     $("stream-h264-bitrate-value").innerHTML = value;
        // });
        // tools.slider.setOnUpDelayed($("stream-h264-bitrate-slider"), 1000, (value) => __sendParam("h264_bitrate", value));

        // tools.slider.setParams($("stream-h264-gop-slider"), 0, 60, 1, 30, function (value) {
        //     $("stream-h264-gop-value").innerHTML = value;
        // });
        // tools.slider.setOnUpDelayed($("stream-h264-gop-slider"), 1000, (value) => __sendParam("h264_gop", value));

        // tools.slider.setParams($("stream-desired-fps-slider"), 0, 120, 1, 0, function (value) {
        //     $("stream-desired-fps-value").innerHTML = (value === 0 ? "Unlimited" : value);
        // });
        // tools.slider.setOnUpDelayed($("stream-desired-fps-slider"), 1000, (value) => __sendParam("desired_fps", value));

        // $("stream-resolution-selector").onchange = (() => __sendParam("resolution", $("stream-resolution-selector").value));

        // 这里调用clickValue  这方法里面会找到h264对应的切换按钮  并调用这个元素原生的
        // tools.radio.setOnClick("stream-mode-radio", this.__clickModeRadio, false);

        // Not getInt() because of radio is a string container.
        // Also don't reset Janus at class init.
        // tools.radio.clickValue("stream-orient-radio", tools.storage.get("stream.orient", 0));
        // tools.radio.setOnClick("stream-orient-radio", function () {
        //     if (__streamer.getMode() === "janus") { // Right now it's working only for H.264
        //         let orient = parseInt(tools.radio.getValue("stream-orient-radio"));
        //         tools.storage.setInt("stream.orient", orient);
        //         if (__streamer.getOrientation() != orient) {
        //             __resetStream();
        //         }
        //     }
        // }, false);

        // tools.slider.setParams($("stream-audio-volume-slider"), 0, 100, 1, 0, function (value) {
        //     $("stream-video").muted = !value;
        //     $("stream-video").volume = value / 100;
        //     $("stream-audio-volume-value").innerHTML = value + "%";
        //     if (__streamer.getMode() === "janus") {
        //         let allow_audio = !$("stream-video").muted;
        //         if (__streamer.isAudioAllowed() !== allow_audio) {
        //             __resetStream();
        //         }
        //     }
        // });

        // tools.el.setOnClick($("stream-screenshot-button"), __clickScreenshotButton);
        // tools.el.setOnClick($("stream-reset-button"), __clickResetButton);

        // $("stream-window").show_hook = () => {
        //     alert('apply')
        //     this.__applyState(__state)
        // };
        // $("stream-window").close_hook = () => __applyState(null);

    }

    private __clickModeRadio (mode = 'janus') {
		console.log('click mode radio')
		// let mode = tools.radio.getValue("stream-mode-radio");
		// 这里是用来判断是 MJPEG 还是 webrtc
		storage.set("stream.mode", mode);
		if (mode !== this.__streamer.getMode()) {
			// tools.hidden.setVisible($("stream-image"), (mode !== "janus"));
			// tools.hidden.setVisible($("stream-video"), (mode === "janus"));
			this.__resetStream(mode);
		}
    }
	

    private __resetStream(mode = null) {
        if (mode === null) {
            mode = this.__streamer.getMode();
        }
        this.__streamer.stopStream();
        if (mode === "janus") {
            this.__streamer = new JanusStreamer(this.__setActive, this.__setInactive, this.__setInfo, storage.getInt("stream.orient", 0), !$("stream-video").muted);
            // Firefox doesn't support RTP orientation:
            //  - https://bugzilla.mozilla.org/show_bug.cgi?id=1316448
            // // tools.feature.setEnabled($("stream-orient"), !tools.browser.is_firefox);
        } else { // mjpeg
            this.__streamer = new MjpegStreamer(this.__setActive, this.__setInactive, this.__setInfo);
            // tools.feature.setEnabled($("stream-orient"), false);
            // tools.feature.setEnabled($("stream-audio"), false); // Enabling in stream_janus.js
        }
        // if (wm.isWindowVisible($("stream-window"))) {
        console.log('reset stream', this.__state)
        this.__streamer.ensureStream(this.__state ? this.__state.streamer : null);
        // }
    }

    private __applyState(state) {
        console.log("APPLY_STATE", state);

        if (state) {
            // tools.feature.setEnabled($("stream-quality"), state.features.quality && (state.streamer === null || state.streamer.encoder.quality > 0));
            // tools.feature.setEnabled($("stream-h264-bitrate"), state.features.h264 && __janus_enabled);
            // tools.feature.setEnabled($("stream-h264-gop"), state.features.h264 && __janus_enabled);
            // tools.feature.setEnabled($("stream-resolution"), state.features.resolution);

            // if (state.streamer) {
            // 	tools.el.setEnabled($("stream-quality-slider"), true);
            // 	tools.slider.setValue($("stream-quality-slider"), state.streamer.encoder.quality);

            // 	if (state.features.h264 && __janus_enabled) {
            // 		__setLimitsAndValue($("stream-h264-bitrate-slider"), state.limits.h264_bitrate, state.streamer.h264.bitrate);
            // 		tools.el.setEnabled($("stream-h264-bitrate-slider"), true);

            // 		__setLimitsAndValue($("stream-h264-gop-slider"), state.limits.h264_gop, state.streamer.h264.gop);
            // 		tools.el.setEnabled($("stream-h264-gop-slider"), true);
            // 	}

            // 	__setLimitsAndValue($("stream-desired-fps-slider"), state.limits.desired_fps, state.streamer.source.desired_fps);
            // 	tools.el.setEnabled($("stream-desired-fps-slider"), true);

            // 	let resolution_str = __makeStringResolution(state.streamer.source.resolution);
            // 	if (__makeStringResolution(__resolution) !== resolution_str) {
            // 		__resolution = state.streamer.source.resolution;
            // 	}

            // 	if (state.features.resolution) {
            // 		let el = $("stream-resolution-selector");
            // 		if (!state.limits.available_resolutions.includes(resolution_str)) {
            // 			state.limits.available_resolutions.push(resolution_str);
            // 		}
            // 		tools.selector.setValues(el, state.limits.available_resolutions);
            // 		tools.selector.setSelectedValue(el, resolution_str);
            // 		tools.el.setEnabled(el, true);
            // 	}

            // } else {
            // 	tools.el.setEnabled($("stream-quality-slider"), false);
            // 	tools.el.setEnabled($("stream-h264-bitrate-slider"), false);
            // 	tools.el.setEnabled($("stream-h264-gop-slider"), false);
            // 	tools.el.setEnabled($("stream-desired-fps-slider"), false);
            // 	tools.el.setEnabled($("stream-resolution-selector"), false);
            // }
            console.log('apply state')
            this.__streamer.ensureStream(state.streamer);

        } else {
            this.__streamer.stopStream();
        }
    }

}