import { writable } from "svelte/store";

export const saveData = writable<any>({})
export const saveCount = 40;
export async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve) => { setTimeout(resolve, milliseconds) });
}