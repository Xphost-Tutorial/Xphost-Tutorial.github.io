import { writable } from "svelte/store";
import gallery1 from "../assets/backgroundImage/MainBack.webp"
import gallery2 from "../assets/backgroundImage/Back2.webp"
import { saveCount } from "../utils";
export const gallerys = writable<any[]>([
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

export const saves = writable<any[]>([
    ...(new Array(saveCount)).fill({})
])