import { browser, cookies } from "@/utils";
import { $ } from "./janus.model";

export const makeId = function() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let count = 0; count < 16; ++count) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

export class MjpegStreamer {
    
	public self = this;

	/************************************************************************/

	public __key = makeId();
	public __id = "";
	public __fps = -1;
	public __state = null;

	public __timer = null;
	public __timer_retries = 0;

	/************************************************************************/
    constructor(private __setActive, private __setInactive, private __setInfo) {}

	public getName = () => "MJPEG";
	public getMode = () => "mjpeg";

	public getResolution = function() {
		let el = $("stream-image");
		return {
			"real_width": el.naturalWidth,
			"real_height": el.naturalHeight,
			"view_width": el.offsetWidth,
			"view_height": el.offsetHeight,
		};
	};

	public ensureStream (state) {
		if (state) {
			this.__state = state;
			this.__findId();
			if (this.__id.length > 0 && this.__id in this.__state.stream.clients_stat) {
				this.__setStreamActive();
				this.__stopChecking();
			} else {
				this.__ensureChecking();
			}
		} else {
			this.__stopChecking();
			this.__setStreamInactive();
		}
	};

	public stopStream () {
		this.ensureStream(null);
		let blank = "/share/png/blank-stream.png";
		if (!String.prototype.endsWith.call($("stream-image").src, blank)) {
			$("stream-image").src = blank;
		}
	};

	public __setStreamActive () {
		let old_fps = this.__fps;
		this.__fps = this.__state.stream.clients_stat[this.__id].fps;
		if (old_fps < 0) {
			this.__logInfo("Active");
			this.__setActive();
		}
		this.__setInfo(true, this.__state.source.online, `${this.__fps} fps dynamic`);
	};

	public __setStreamInactive () {
		let old_fps = this.__fps;
		this.__key = makeId();
		this.__id = "";
		this.__fps = -1;
		this.__state = null;
		if (old_fps >= 0) {
			this.__logInfo("Inactive");
			this.__setInactive();
			this.__setInfo(false, false, "");
		}
	};

	public __ensureChecking () {
		if (!this.__timer) {
			this.__timer_retries = 10;
			this.__timer = setInterval(this.__checkStream, 100);
		}
	};

	public __stopChecking () {
		if (this.__timer) {
			clearInterval(this.__timer);
		}
		this.__timer = null;
		this.__timer_retries = 0;
	};

	public __findId () {
		let stream_client = cookies.get("stream_client");
		if (this.__id.length === 0 && stream_client && stream_client.startsWith(this.__key + "/")) {
			this.__logInfo("Found acceptable stream_client cookie:", stream_client);
			this.__id = stream_client.slice(stream_client.indexOf("/") + 1);
		}
	};

	public __checkStream () {
		this.__findId();

		if (this.__id.length > 0 && this.__id in this.__state.stream.clients_stat) {
			this.__setStreamActive();
			this.__stopChecking();

		} else if (this.__id.length > 0 && this.__timer_retries >= 0) {
			this.__timer_retries -= 1;

		} else {
			this.__setStreamInactive();
			this.__stopChecking();

			let path = `/streamer/stream?key=${this.__key}`;
			if (browser.is_safari || browser.is_ios) {
				// uStreamer fix for WebKit
				this.__logInfo("Using dual_final_frames=1 to fix WebKit bugs");
				path += "&dual_final_frames=1";
			} else if (browser.is_chrome || browser.is_blink) {
				// uStreamer fix for Blink https://bugs.chromium.org/p/chromium/issues/detail?id=527446
				this.__logInfo("Using advance_headers=1 to fix Blink bugs");
				path += "&advance_headers=1";
			}

			this.__logInfo("Refreshing ...");
			$("stream-image").src = path;
		}
	};

	public __logInfo (...args){
        console.log("Stream [MJPEG]:", ...args);
    } 

}