<!--
 * @Author: shufei.han
 * @Date: 2024-10-16 10:39:46
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-25 16:31:08
 * @FilePath: \kvm-web-vue3\src\views\kvm\KvmWebRtcPlayer.vue
 * @Description: 
-->
<template>
    <div class="kvm-webRtc-player-container full-height">
        <div class="video-container full-height flex items-start">
            <div class="video-content">
                <!-- <p>{{ props.state }}</p> -->
                 <GlRadioButtons style="width: 1000px;" :options="OrientationOptionList" v-model:value="state.orient" @input="handleRadioChange" />
                <p>
                    <span>{{ resolutionText }}</span>
                    <span style="padding: 0 8px;">{{ '/' }}</span>
                    <span>{{ fpsStreamInfo }}</span>
                </p>
                <div ref="streamBoxRef" id="stream-box" tabindex="-1">
                    <video id="stream-video" autoplay muted></video>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useJanusWsSocketMsgs } from '@/hooks/useSocketMsgs';
import { JanusStreamer } from '@/models/janus.model';
import { KeyboardEventHandler } from '@/models/keyboard.model';
import { OrientationOptionList, OrientationType } from '@/models/kvm.model';
import { MouseEventHandler } from '@/models/mouse.model';
import { StreamEventState } from '@/models/state.model';
import { useKvmStore } from '@/stores/kvm';
import { Janus } from '@/utils/janus';
import { GlRadioButtons } from '@gl/main/components';
import { computed, onMounted, reactive, ref } from 'vue';

const props = defineProps<{ streamState?: StreamEventState }>()
const streamBoxRef = ref<HTMLElement>()
const kvmStore = useKvmStore()

// useJanusWsSocketMsgs()
const state = reactive({
    orient: OrientationType.DEFAULT,
    allowAudio: true,
    info: [],
    janus: {} as JanusStreamer,
    mouseHandler: null as MouseEventHandler,
    keyboardHandler: null as KeyboardEventHandler,
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

const setActive = () => {
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
.kvm-webRtc-player-container {
    min-width: 400px;
    min-height: 200px;
    resize: both;
    overflow: hidden;

    .video-container {
        padding-top: 64px;
        .video-content {
            max-width: 1000px;
            max-height: 500px;
            video {
                max-width: 100%;
                max-height: 100%;
            }
        }

        img {
            width: 80%;
            background-color: red;
        }
    }
}
</style>