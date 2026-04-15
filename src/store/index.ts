import { writable } from "svelte/store";
import gallery1 from "../assets/backgroundImage/MainBack.webp"
import gallery2 from "../assets/backgroundImage/Back2.webp"
import { saveCount } from "../utils";
export const gallerys = writable<{ gallery: string[], lock: boolean }[]>([
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery2, gallery1],
        lock: true
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
    {
        gallery: [gallery1, gallery2],
        lock: true
    },
    {
        gallery: [gallery1, gallery2],
        lock: false
    },
])

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