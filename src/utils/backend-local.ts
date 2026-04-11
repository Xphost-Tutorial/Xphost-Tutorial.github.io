import { saveCount, saveData } from ".";
export async function init() {
  let savedata = JSON.parse(localStorage.getItem("tutorial_data") ?? "{}");
  if (savedata.gallery === undefined) savedata.gallery = {};
  if (savedata.saveInstance === undefined) savedata.saveInstance = {};
  if (savedata.global === undefined) savedata.global = {};
  for (let i = 1; i <= saveCount; i++) {
    if (savedata.saveInstance[`save${i}`] === undefined)
      savedata.saveInstance[`save${i}`] = { current: 0, name: "", updateTime: "", chapter: 0 };
  }
  console.log(savedata);
  saveData.set(savedata);
  localStorage.setItem("tutorial_data", JSON.stringify(savedata));
}
export async function save(
  id: number,
  updateTime: string,
  name: string,
  chapter: number,
  current: number,
  branches: object = {},
) {
  let savedata = JSON.parse(localStorage.getItem("tutorial_data") ?? "{}");
  savedata.saveInstance[`save${id}`].current = current;
  savedata.saveInstance[`save${id}`].name = name;
  savedata.saveInstance[`save${id}`].remark = "";
  savedata.saveInstance[`save${id}`].chapter = chapter;
  savedata.saveInstance[`save${id}`].updateTime = updateTime;
  for (let [key, value] of Object.entries(branches)) {
    savedata.saveInstance[`save${id}`][`bch_${key}`] = value
  }
  localStorage.setItem("tutorial_data", JSON.stringify(savedata));
}
export async function unlockGallery(id: string) {
  let savedata = JSON.parse(localStorage.getItem("tutorial_data") ?? "{}");
  savedata.gallery[id] = true;
  localStorage.setItem("tutorial_data", JSON.stringify(savedata));
}

export async function updateGlobal(id: string, value: string) {
  let savedata = JSON.parse(localStorage.getItem("tutorial_data") ?? "{}");
  savedata.global[id] = value;
  localStorage.setItem("tutorial_data", JSON.stringify(savedata));
}

export async function reset() {
  localStorage.setItem("tutorial_data", "{}");
  await init();
}
export function closeWindow() {
  alert("现代浏览器不允许直接在 JavaScript 里关闭标签页，请手动关闭喵~")
}
export function openUrl(url: string) {
  window.open(url, "_blank")
}