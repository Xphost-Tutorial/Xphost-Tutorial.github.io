import { invoke } from "@tauri-apps/api/core";
import { window } from "@tauri-apps/api";
import { saveCount, saveData } from ".";

export async function init() {
  const savedata = JSON.parse(await invoke("init_app", {
    saveCount: saveCount,
  })) as any;
  console.log(savedata);
  saveData.set(savedata);
}
export async function save(
  id: number,
  name: string,
  updateTime: string,
  current: number,
  chapter: number,
  branches: object = {},
) {
  await invoke("save", {
    id,
    updateTime,
    name,
    chapter,
    current,
    branches,
  });
}
export async function unlockGallery(id: string) {
  await invoke("update_gallery", { id });
}

export async function updateGlobal(id: string, value: string) {
  await invoke("update_global", { id, value })
}

export async function reset() {
  await invoke("reset", {});
  init();
}
export function closeWindow() {
  window.getCurrentWindow().close();
}
