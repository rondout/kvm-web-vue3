/*
 * @Author: shufei.han
 * @Date: 2024-11-20 16:21:48
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-21 10:09:49
 * @FilePath: \kvm-web-vue3\src\models\janus.model.ts
 * @Description: 
 */
import { Janus } from '@/utils/janus'

type AnyFunction = (...args: any[]) => any

const $ = (id:string) =>  document.getElementById(id) as HTMLVideoElement

export class JanusStreamer {
    public _Janus: any
    public janus: any
    public handle: any
    public stop = false
    public ensuring = false;

    public retry_ensure_timeout = null;
    public retry_emsg_timeout = null;
    public info_interval = null;

    public state = null;
    public frames = 0;

    constructor(private setActive: AnyFunction, private setInactive: AnyFunction, private setInfo: AnyFunction, private orient: any, private allow_audio: boolean) {
        this.initJanus(() => {
            this.ensureJanus()
        })
        window.j = this
    }


    ensureStream(state) {
        console.log("ENSURE_STREAM", state);
        
        this.state = state
        this.ensureJanus()
    }
    initJanus(callback: () => void) {
        log('Starting Janus ...')
        Janus.init({
            debug: 'all',
            callback: () => {
                this._Janus = Janus
                callback()
            }
        })
    }

    attachJanus() {
        console.log("ATTACH", this.janus);
        const { janus } = this
        if (janus === null) {
            return;
        }
        janus.attach({
            "plugin": "janus.plugin.ustreamer",
            "opaqueId": "oid-" + this._Janus.randomString(12),

            success: (handle) => {
                log('SUCCESSSSSSSSSSSSS', handle)
                this.handle = handle;
                log("uStreamer attached:", handle.getPlugin(), handle.getId());
                this.__sendWatch();
            },

            error: (error) => {
                log("Can't attach uStreamer: ", error);
                this.setInfo(false, false, error);
                this.destroyJanus();
            },

            connectionState: (state) => {
                log("Peer connection state changed to", state);
                if (state === "failed") {
                    this.destroyJanus();
                }
            },

            iceState: (state) => {
                log("ICE state changed to", state);
            },

            webrtcState: (up) => {
                log("Janus says our WebRTC PeerConnection is", (up ? "up" : "down"), "now");
                if (up) {
                    this.sendKeyRequired();
                }
            },

            onmessage: (msg, jsep) => {
                this.stopRetryEmsgInterval();

                if (msg.result) {
                    log("Got uStreamer result message:", msg.result.status); // starting, started, stopped
                    if (msg.result.status === "started") {
                        this.setActive();
                        this.setInfo(false, false, "");
                    } else if (msg.result.status === "stopped") {
                        this.setInactive();
                        this.setInfo(false, false, "");
                    } else if (msg.result.status === "features") {
                        // tools.feature.setEnabled($("stream-audio"), msg.result.features.audio);
                    }
                } else if (msg.error_code || msg.error) {
                    log("Got uStreamer error message:", msg.error_code, "-", msg.error);
                    this.setInfo(false, false, msg.error);
                    if (this.retry_emsg_timeout === null) {
                        this.retry_emsg_timeout = setTimeout(() => {
                            if (!this.stop) {
                                this.sendStop();
                                this.sendWatch();
                            }
                            this.retry_emsg_timeout = null;
                        }, 2000);
                    }
                    return;
                } else {
                    log("Got uStreamer other message:", msg);
                }

                if (jsep) {
                    log("Handling SDP:", jsep);
                    let tracks = [{ "type": "video", "capture": false, "recv": true, "add": true }];
                    if (this.allow_audio) {
                        tracks.push({ "type": "audio", "capture": false, "recv": true, "add": true });
                    }
                    this.handle.createAnswer({
                        "jsep": jsep,

                        // Janus 1.x
                        "tracks": tracks,

                        // Janus 0.x
                        "media": { "audioSend": false, "videoSend": false, "data": false },

                        // Chrome is playing OPUS as mono without this hack
                        //   - https://issues.webrtc.org/issues/41481053 - IT'S NOT FIXED!
                        //   - https://github.com/ossrs/srs/pull/2683/files
                        customizeSdp: (jsep) => {
                            jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                        },

                        success: (jsep) => {
                            log("Got SDP:", jsep);
                            this.sendStart(jsep);
                        },

                        error: (error) => {
                            log("Error on SDP handling:", error);
                            this.setInfo(false, false, error);
                            //destroyJanus();
                        },
                    });
                }
            },

            // Janus 1.x
            onremotetrack: (track, id, added, meta) => {
                // Chrome sends `muted` notifiation for tracks in `disconnected` ICE state
                // and Janus.js just removes muted track from list of available tracks.
                // But track still exists actually so it's safe to just ignore
                // reason == "mute" and "unmute".
                let reason = (meta || {}).reason;
                log("Got onremotetrack:", id, added, reason, track, meta);
                if (added && reason === "created") {
                    this.addTrack(track);
                    if (track.kind === "video") {
                        this.sendKeyRequired();
                        this.startInfoInterval();
                    }
                } else if (!added && reason === "ended") {
                    this.removeTrack(track);
                }
            },

            // Janus 0.x
            onremotestream: (stream) => {
                if (stream === null) {
                    // https://github.com/pikvm/pikvm/issues/1084
                    // Этого вообще не должно происходить, но почему-то янусу в unmute
                    // может прилететь null-эвент. Костыляем, наблюдаем.
                    log("Got invalid onremotestream(null). Restarting Janus...");
                    this.destroyJanus();
                    return;
                }

                let tracks = stream.getTracks();
                log("Got a remote stream changes:", stream, tracks);

                let has_video = false;
                for (let track of tracks) {
                    if (track.kind == "video") {
                        has_video = true;
                        break;
                    }
                }

                if (!has_video && this.isOnline()) {
                    // Chrome sends `muted` notifiation for tracks in `disconnected` ICE state
                    // and Janus.js just removes muted track from list of available tracks.
                    // But track still exists actually so it's safe to just ignore that case.
                    return;
                }

                this._Janus.attachMediaStream($("stream-video"), stream);
                this.sendKeyRequired();
                this.startInfoInterval();

                // FIXME: Задержка уменьшается, но начинаются заикания на кейфреймах.
                //   - https://github.com/Glimesh/janus-ftl-plugin/issues/101
                /*if (this.handle && this.handle.webrtcStuff && this.handle.webrtcStuff.pc) {
                    for (let receiver of this.handle.webrtcStuff.pc.getReceivers()) {
                        if (receiver.track && receiver.track.kind === "video" && receiver.playoutDelayHint !== undefined) {
                            receiver.playoutDelayHint = 0;
                        }
                    }
                }*/
            },

            oncleanup: () => {
                log("Got a cleanup notification");
                this.stopInfoInterval();
            },
        });
    }

    ensureJanus(internal?: boolean) {
        log('Ensuring Janus', internal)
        this.janus = new this._Janus({
            server: 'ws://localhost:5173/janus/ws',
            success: () => {
                this.attachJanus()
            },
            error(err) {
                log('Janus error:', err)
            }
        })
        log(this.janus)
        // @ts-ignore
    }

    // ***************************************
    __sendWatch() {
        if (this.handle) {
            log(`Sending WATCH(orient=${this.orient}, audio=${this.allow_audio}) + FEATURES ...`);
            this.handle.send({ "message": { "request": "features" } });
            this.handle.send({
                "message": {
                    "request": "watch", "params": {
                        "orientation": this.orient,
                        "audio": this.allow_audio,
                    }
                }
            });
        }
    };
    destroyJanus() {
        if (this.janus !== null) {
            this.janus.destroy();
        }
        this.__finishJanus();
        // let stream = $("stream-video").srcObject;
        // if (stream) {
        //     for (let track of stream.getTracks()) {
        //         __removeTrack(track);
        //     }
        // }
    }
    __finishJanus() {
        if (this.stop) {
            if (this.retry_ensure_timeout !== null) {
                clearTimeout(this.retry_ensure_timeout);
                this.retry_ensure_timeout = null;
            }
            this.ensuring = false;
        } else {
            if (this.retry_ensure_timeout === null) {
                this.retry_ensure_timeout = setTimeout(() => {
                    this.retry_ensure_timeout = null;
                    this.ensureJanus(true);
                }, 5000);
            }
        }
        this.stopRetryEmsgInterval();
        this.stopInfoInterval();
        if (this.handle) {
            log("uStreamer detaching ...:", this.handle.getPlugin(), this.handle.getId());
            this.handle.detach();
            this.handle = null;
        }
        this.janus = null;
        this.setInactive();
        if (this.stop) {
            this.setInfo(false, false, "");
        }
    }

    stopRetryEmsgInterval() {
        if (this.retry_emsg_timeout !== null) {
            clearTimeout(this.retry_emsg_timeout);
            this.retry_emsg_timeout = null;
        }
    };

    stopInfoInterval() {
        if (this.info_interval !== null) {
            clearInterval(this.info_interval);
        }
        this.info_interval = null;
    }

    isOnline() {
        return !!(this.state && this.state.source && this.state.source.online);
    }

    sendKeyRequired() { }

    startInfoInterval() {
        this.stopInfoInterval();
        this.setActive();
        this.updateInfo();
        this.info_interval = setInterval(() => this.updateInfo(), 1000);
    }

    updateInfo() {
        if (this.handle !== null) {
            let info = "";
            if (this.handle !== null) {
                // https://wiki.whatwg.org/wiki/Video_Metrics
                let frames = null;
                // @ts-ignore
                let el = $("stream-video");
                if (el.webkitDecodedFrameCount !== undefined) {
                    frames = el.webkitDecodedFrameCount;
                } else if (el.mozPaintedFrames !== undefined) {
                    frames = el.mozPaintedFrames;
                }
                
                info = `${this.handle.getBitrate()}`.replace("kbits/sec", "kbps");
                if (frames !== null) {
                    info += ` / ${Math.max(0, frames - this.frames)} fps dynamic`;
                    frames = frames;
                }
            }
            this.setInfo(true, this.isOnline(), info);
        }
    }

    sendStop() {
        this.stopInfoInterval();
        if (this.handle) {
            log("Sending STOP ...");
            this.handle.send({ "message": { "request": "stop" } });
            this.handle.hangup();
        }
    }

    sendWatch() {
        if (this.handle) {
            log(`Sending WATCH(orient=${this.orient}, audio=${this.allow_audio}) + FEATURES ...`);
            this.handle.send({ "message": { "request": "features" } });
            this.handle.send({
                "message": {
                    "request": "watch", "params": {
                        "orientation": this.orient,
                        "audio": this.allow_audio,
                    }
                }
            });
        }
    }

    addTrack(track) {
        let el = $("stream-video");
        if (el.srcObject) {
            for (let tr of el.srcObject.getTracks()) {
                if (tr.kind === track.kind && tr.id !== track.id) {
                    this.removeTrack(tr);
                }
            }
        }
        if (!el.srcObject) {
            el.srcObject = new MediaStream();
        }
        el.srcObject.addTrack(track);
    }

    removeTrack(track) {
        log("Removing track:", track);
        // let el = $("stream-video");
        // if (!el.srcObject) {
        // 	return;
        // }
        // track.stop();
        // el.srcObject.removeTrack(track);
        // if (el.srcObject.getTracks().length === 0) {
        // 	// MediaStream should be destroyed to prevent old picture freezing
        // 	// on Janus reconnecting.
        // 	el.srcObject = null;
        // }
    }

    sendStart (jsep) {
		if (this.handle) {
			log("Sending START ...");
			this.handle.send({ "message": { "request": "start" }, "jsep": jsep });
		}
	}
}
