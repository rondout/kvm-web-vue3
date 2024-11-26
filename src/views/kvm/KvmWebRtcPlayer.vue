<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:39:46
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-26 14:27:45
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmWebRtcPlayer.vue
 * @Description: 
-->
<template>
    <div class="kvm-webRtc-player-container full-height">
        <div class="video-container full-height flex items-start">
            <div class="video-content">
                <!-- <p>{{ props.state }}</p> -->
                <GlRadioButtons style="width: 1000px;" :options="OrientationOptionList" v-model:value="state.orient"
                    @input="handleRadioChange" />
                <div class="flex-start">
                    <span style="padding-right: 16px;">h.264 kbps</span>
                    <a-slider @change="handleBiterateChange" :step="25" v-model:value="state.kbps" class="flex-1" :min="25" :max="20000"></a-slider>
                    <span>{{ state.kbps }}</span>
                </div>
                <div class="flex-start">
                    <span style="padding-right: 16px;">h.264 gop</span>
                    <a-slider @change="handleGopChange" v-model:value="state.gop" class="flex-1" :min="0" :max="60"></a-slider>
                    <span>{{ state.gop }}</span>
                </div>
                <p>
                    <span>{{ resolutionText }}</span>
                    <span style="padding: 0 8px;">{{ '/' }}</span>
                    <span>{{ fpsStreamInfo }}</span>
                    <a-button @click="fullScreen">全屏</a-button>
                </p>
                <div ref="streamBoxRef" id="stream-box" tabindex="-1" @blur="handleStreamBoxBlur"
                    @focus="handleStreamBoxFocus">
                    <video id="stream-video" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" autoplay
                        muted></video>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { mainService } from '@/api/main';
import { useJanusWsSocketMsgs } from '@/hooks/useSocketMsgs';
import { JanusStreamer } from '@/models/janus.model';
import { KeyboardEventHandler } from '@/models/keyboard.model';
import { OrientationOptionList, OrientationType } from '@/models/kvm.model';
import { MouseEventHandler } from '@/models/mouse.model';
import { StreamEventState } from '@/models/state.model';
import { useKvmStore } from '@/stores/kvm';
import { useMsgStore } from '@/stores/message';
import { Janus } from '@/utils/janus';
import { GlRadioButtons } from '@gl/main/components';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const props = defineProps<{ streamState?: StreamEventState }>()
const streamBoxRef = ref<HTMLElement>()
const kvmStore = useKvmStore()
const msgStore = useMsgStore()

// useJanusWsSocketMsgs()
const state = reactive({
    orient: OrientationType.DEFAULT,
    allowAudio: true,
    info: [],
    janus: {} as JanusStreamer,
    mouseHandler: null as MouseEventHandler,
    keyboardHandler: null as KeyboardEventHandler,
    kbps: msgStore?.streamerState?.params?.h264_bitrate,
    gop: msgStore?.streamerState?.params?.h264_gop,
})

const h264Args = computed(() => {
    try {
        const {h264_bitrate, h264_gop} = msgStore.streamerState.params
        return {h264_bitrate, h264_gop}
    } catch (error) {
        return null
    }
})

watch(() => h264Args.value, () => {
    const {h264_bitrate: kbps, h264_gop: gop} = h264Args.value || {}
    state.kbps = kbps
    state.gop = gop
})

const fpsStreamInfo = computed(() => {
    return state.info[2] || ''
})

/** 分辨率信息 */
const resolutionText = computed(() => {
    try {
        // let title = `${state.janus.getName()} &ndash; `;
        // if (is_active) {
        // 	if (!online) {
        // 		title += "No signal / ";
        // 	}
        // 	title += __makeStringResolution(__resolution);
        // 	if (text.length > 0) {
        // 		title += " / " + text;
        // 	}
        // } else {
        // 	if (text.length > 0) {
        // 		title += text;
        // 	} else {
        // 		title += "Inactive";
        // 	}
        // }
        let title = state.janus?.getName()
        const { width, height } = props.streamState.streamer.source.resolution
        return `${title} - ${width}x${height}`
    } catch (error) {
        return ''
    }
})

const handleBiterateChange = (value) => {
    mainService.updateH264Args({ h264_bitrate: value })
}

const handleGopChange = (value) => {
    mainService.updateH264Args({ h264_gop: value })
}

const setActive = () => {
    log(msgStore?.streamerState?.params?.h264_bitrate)
    state.kbps = msgStore?.streamerState?.params?.h264_bitrate
    state.gop = msgStore?.streamerState?.params?.h264_gop
    kvmStore.setStreamState(true)
}
const setInactive = () => {
    kvmStore.setStreamState(false)
}
const setInfo = (...args: any) => {
    // log('setInfo', args)
    state.info = args
}

const focusInOut = (event: FocusEvent, isFocus: boolean) => {
    // console.log('focusInOut: ', event, isFocus);
}

const handleStreamBoxBlur = (event: FocusEvent) => {
    // console.log('handleStreamBoxBlur: ', event);
    streamBoxRef.value?.focus()
}

const handleStreamBoxFocus = (event: FocusEvent) => {
    // console.log('handleStreamBoxFocus: ', event);
}

const handleMouseEnter = () => {
    kvmStore.setMouseEnabled(true)
}
const handleMouseLeave = () => {
    kvmStore.setMouseEnabled(false)
}

const fullScreen = () => {
    streamBoxRef.value.requestFullscreen()
}

const initWindowEvent = () => {
    window.addEventListener('focusin', (event) => focusInOut(event, true))
    window.addEventListener('focusout', (event) => focusInOut(event, false))
}

const init = () => {
    const janus = new JanusStreamer(setActive, setInactive, setInfo, state.orient, state.allowAudio)
    state.janus = janus
}

const handleRadioChange = (value: OrientationType) => {
    state.orient = value
    state.janus.stopStream()
    init()
}

onMounted(() => {
    // Janus.init({})
    // // @ts-ignore
    // new Janus({
    //     server: 'ws://localhost:5173/janus/ws', success() {
    //         console.log("SUCCESS");
    //     },
    //     error(err) {
    //         console.log("ERROR: ", err);
    //     }
    // })
    init()
    initWindowEvent()
    state.mouseHandler = new MouseEventHandler(streamBoxRef.value)
    state.keyboardHandler = new KeyboardEventHandler(streamBoxRef.value)
})

</script>

<style lang="scss" scoped>
p {
    margin: 0;
}
.kvm-webRtc-player-container {
    min-width: 400px;
    min-height: 200px;
    resize: both;
    overflow: hidden;

    .video-container {
        padding-top: 12px;
        overflow: auto;
        .video-content {
            // max-width: 1000px;
            // max-height: 500px;

            #stream-box {
                height: 720px;
            }

            video {
                width: 100%;
                height: 100%;
            }
        }

        img {
            width: 80%;
            background-color: red;
        }
    }

    #stream-box {
        border: 2px var(--primary) solid;

        &:focus {
            border-color: red;
        }
    }
}
</style>