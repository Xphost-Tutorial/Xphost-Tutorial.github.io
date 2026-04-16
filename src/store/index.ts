import { writable } from "svelte/store";
import gallery1 from "../assets/backgroundImage/MainBack.webp"
import gallery2 from "../assets/backgroundImage/Back2.webp"
export const gallerys = writable<any>({
    家庭: {
        gallery: [gallery1, gallery2],
        lock: false
    },
    苹果: {
        gallery: [gallery1, gallery2],
        lock: false
    },
    树: {
        gallery: [gallery1, gallery2],
        lock: false
    },
    玩耍: {
        gallery: [gallery2, gallery1],
        lock: true
    },
    电脑: {
        gallery: [gallery1, gallery2],
        lock: false
    },
    杯子: {
        gallery: [gallery1, gallery2],
        lock: false
    },
    广场: {
        gallery: [gallery1, gallery2],
        lock: false
    },
    飞机: {
        gallery: [gallery1, gallery2],
        lock: false
    },
})

export const currentSave = writable<any>({
    current: -1,
    name: "",
    chapter: 0,
    updateTime: "",
    image: "",
})

export const quickSave = writable<any>({
    current: -1,
    name: "",
    chapter: 0,
    updateTime: "",
    image: ""
})