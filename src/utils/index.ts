import { writable } from "svelte/store";

export const saveData = writable<{ gallery: any, saveInstance: any, global: any }>({
    gallery: undefined,
    saveInstance: undefined,
    global: undefined
})
export const saveCount = 40;
export async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve) => { setTimeout(resolve, milliseconds) });
}