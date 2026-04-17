<script lang="ts">
  import { onMount } from "svelte";
  import dialog from "../../store/dialog.yml";
  import { saveData, sleep } from "../../utils";
  import MyMenu from "./MyMenu.svelte";
  import { currentSave, quickSave } from "../../store";
  import { goto } from "$app/navigation";
  import html2canvas from "html2canvas-oklch";
  import { updateGlobal } from "../../utils/backend-tauri";
  let dialogCurrent = $state("");
  let lockText = false;
  let exitText = false;
  let menuNum = $state(-1);
  let menuTitle = $state("");
  let isQuick = $state(false);
  let isAuto = $state(false);
  function gc(): number {
    return $currentSave.current;
  }
  function sc(num: number) {
    currentSave.set({
      ...$currentSave,
      current: num,
    });
  }
  function ac(num: number) {
    currentSave.set({
      ...$currentSave,
      current: $currentSave.current + num,
    });
  }
  function setGS(key: string, value: string) {
    saveData.set({
      ...$saveData,
      global: {
        ...$saveData.global,
        [key]: value,
      },
    });
    updateGlobal(key, value);
  }
  function setCS(key: string, value: any) {
    currentSave.set({
      ...$currentSave,
      [key]: value,
    });
  }
  function backToMain() {
    isQuick = false;
    isAuto = false;
    goto("/");
  }
  function gsi(key: string | undefined = undefined): any {
    if (key) return $currentSave[key];
    else return $currentSave;
  }
  function gd(index: number): any {
    return dialog.start[index] ?? {};
  }
  async function doStyle(current: number, isQuick: boolean) {
    if (!isQuick) await sleep(500);
  }
  /**
   * 判断 if 规则的函数，返回是否应该跳过
   * @param action if 规则
   */
  function judgeRule(action: string): boolean {
    let res = false;
    const fasplit = action.split("|");
    if (fasplit.length === 3) {
      if (fasplit[1] === "<") {
        if (parseFloat(gsi(fasplit[0])) < parseFloat(fasplit[2])) {
          res = true;
        }
      } else if (fasplit[1] === ">") {
        if (parseFloat(gsi(fasplit[0])) > parseFloat(fasplit[2])) {
          res = true;
        }
      } else if (fasplit[1] === "<=") {
        if (parseFloat(gsi(fasplit[0])) <= parseFloat(fasplit[2])) {
          res = true;
        }
      } else if (fasplit[1] === ">=") {
        if (parseFloat(gsi(fasplit[0])) >= parseFloat(fasplit[2])) {
          res = true;
        }
      } else if (fasplit[1] === "==") {
        if (parseFloat(gsi(fasplit[0])) === parseFloat(fasplit[2])) {
          res = true;
        }
      }
    } else if (fasplit.length === 2) {
      if (gsi(fasplit[0]) === fasplit[2]) {
        res = true;
      }
    }
    return res;
  }
  /**
   * 自动判断分支和 goto 语句的跳过
   * @param index 当前分支
   * @param ps 前进还是后退
   */
  function jumpTo(index: number, ps: boolean): number {
    let resNum = index;
    while (true) {
      const j = gd(resNum + (ps ? 1 : -1)).if;
      if (j && j.length > 0) {
        let result = true;
        const firstAction = j[0]!.action;
        result = judgeRule(firstAction);
        for (let i = 1; i < j.length; i++) {
          const action = j[i].action;
          const next = j[i].next;
          if (next === "and") {
            result = result && judgeRule(action);
          } else if (next === "or") {
            result = result || judgeRule(action);
          }
        }
        if (result) break;
      } else break;
    }
    return resNum;
  }
  /**
   * 通过 nextOne 自动判断分支和 goto（仅向前）
   * @param index 当前分支
   * @param plus 是否 jumpTo
   * @returns 第一个值是一个标记值，用于标记当前是选择还是别的。见下表
   *
   * 第二个值是 真实的 当前 jumpTo 值！
   *
   * 1. -100：是个错误（没有 message，type 也不是正常的。）
   * 2. 0：代表是正常的 message！
   * 3. -1：到剧本末尾了。
   * 4. -2：当前是个选项。
   * 5. -3：当前是个结局。
   * 6. -4：当前是个赋值。
   */
  function nextOne(index: number, plus: boolean): [number, number] {
    let resNum = index;
    if (resNum >= dialog.start.length) return [-1, resNum];
    if (
      gd(resNum).type === "goto" &&
      gd(resNum).if &&
      gd(resNum).if.length >= 0
    ) {
    }
    if (plus) {
      resNum = jumpTo(resNum, true);
      resNum++;
    }
    if (gd(resNum).type === "choice") return [-2, resNum];
    if (gd(resNum).message === undefined) return [-100, resNum];
    return [0, resNum];
  }
  onMount(async () => {
    let m = 0;
    while (m < gc()) {
      let [n, r] = nextOne(m, false);
      if (n === 0) {
        m = r;
        m = jumpTo(m, true);
        await doStyle(m, true);
      } else if (n == -2) {
        m = jumpTo(m, true);
        await doStyle(m, true);
      } else if (n === -100) {
        break;
      }
      m++;
    }
    await next();
  });
  let keyLock = false;
  function spaceDown(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.code === "Space") {
      if (!keyLock) {
        keyLock = true;
        next();
      }
    }
  }
  function spaceUp(e: KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.code === "Space") {
      keyLock = false;
    }
  }
  /**
   * 正常往下跳转一格
   * @param plus 是否跳转 +1。如果不需要 +1，例如此时是选择 choice 的话，就需要设置成 false
   */
  async function next(plus: boolean = true) {
    isQuick = false;
    if (menuNum !== -1) {
      return;
    }
    if (lockText) {
      exitText = true;
      dialogCurrent = dialog.start[gc()].message;
      lockText = false;
      return;
    }
    if (gc() === -1) {
      ac(1);
    }
    let [n, r] = nextOne(gc(), plus);
    if (n === -100 || n === -1) return;
    const d = dialog.start[gc()];
    if (!d?.type) {
      backToMain();
      return;
    }
    if (d?.type === "message") {
      dialogCurrent = "";
      lockText = true;
      const ct = d.message;
      let isLt = false;
      exitText = false;
      for (let i = 0; i < (ct.length ?? 0); i++) {
        if (exitText) {
          break;
        }
        if (ct[i] === "<") {
          isLt = true;
        }
        if (ct[i] === ">") {
          isLt = false;
        }
        if (!isLt) await sleep(200 - $saveData.global.textSpeed); // TODO: 设置
        if (exitText) {
          break;
        }
        dialogCurrent += ct[i];
        if (exitText) {
          break;
        }
      }
      exitText = false;
      lockText = false;
    } else if (d?.type === "choice") return;
    else if (d?.type === "value") {
      const id = d.valueId;
      const action = d.action;
      const asplit = action.split("|");
      if (asplit.length === 2) {
        if (asplit[0] === "set") {
          setCS(id, asplit[1]);
        } else if (asplit[0] === "add") {
          let nr = Number(gsi(id));
          let nv = Number(asplit[1]);
          if (nv && nr) {
            setCS(id, nr + nv);
          }
        } else if (asplit[0] === "sub") {
          let nr = Number(gsi(id));
          let nv = Number(asplit[1]);
          if (nv && nr) {
            setCS(id, nr - nv);
          }
        }
      }
      next(plus);
    }
    sc(r);
  }
  function prev() {
    ac(-1);
    if (gc() < 0) {
      ac(1);
      return;
    }
    const d = dialog.start[gc()];
    if (d.type === "message") {
      dialogCurrent = d.message;
      exitText = true;
    } else {
      prev();
    }
  }
  async function waitSave() {
    function addZero(num: number) {
      return num > 9 ? num : "0" + num;
    }
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const canvas = await html2canvas(document.querySelector(".\\@container")!, {
      scale: 0.5,
      backgroundColor: "#000000",
      logging: false,
      useCORS: false,
      allowTaint: false,
      imageTimeout: 0,
    });
    const base64DataURL = canvas.toDataURL("image/jpeg", 0.8);
    setCS(
      "updateTime",
      `${date.getFullYear()}-${addZero(month)}-${addZero(day)} ${addZero(hour)}:${addZero(minute)}`,
    );
    setCS("image", base64DataURL);
  }
  setInterval(() => {
    if (isQuick) {
      ac(1);
      const d = dialog.start[gc()];
      if (!d?.type) {
        backToMain();
        return;
      }
      if (d.type === "message") {
        dialogCurrent = d.message;
      } else {
        isQuick = false;
      }
    }
  }, 20);
  setInterval(() => {
    if (isAuto) {
      next();
    }
  }, $saveData.global.autoSpeed * 100); // TODO: 设置
  document.addEventListener("wheel", (e: WheelEvent) => {});
</script>

<main class="fixed top-0 left-0 w-screen h-screen">
  <div
    class="@container flex aspect-video max-w-screen max-h-screen absolute left-0 right-0 top-0 bottom-0 m-auto bg-black"
    onkeydown={spaceDown}
    onkeyup={spaceUp}
    tabindex="0"
    role="button"
    onclick={next}
  >
    {#if menuNum !== -1}
      <MyMenu
        title={menuTitle}
        num={menuNum}
        result={(k = false) => {
          if (k) prev();
          menuNum = -1;
        }}
      ></MyMenu>
    {/if}
    <div
      class="absolute bottom-0 flex flex-col items-center left-0 w-full min-h-[15cqi] bg-[linear-gradient(to_right,#FFFFFF77_0%,#00000077_20%,#00000077_80%,#FFFFFF77_100%)]"
    >
      <div class="flex flex-col w-3/5 h-full flex-1 items-center">
        <div class="w-full text-left">
          {@html dialog.start[gc()]?.name || "　"}
        </div>
        <div
          class="text-left px-[2cqi] w-full flex-1 *:text-white text-white"
          style="font-size: 1.6cqi"
        >
          {@html dialogCurrent}
        </div>
        <div class="flex justify-center gap-[2cqi]">
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isQuick = false;
              isAuto = false;
              prev();
            }}
            aria-label="回退">回退</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              isQuick = false;
              isAuto = false;
              await waitSave();
              menuTitle = "历史";
              menuNum = 0;
            }}
            aria-label="历史">历史</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style={`font-size: 1cqi; ${isQuick ? "color: white;" : ""}`}
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isQuick = true;
              isAuto = false;
            }}
            aria-label="快进">快进</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style={`font-size: 1cqi; ${isAuto ? "color: white;" : ""}`}
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isQuick = false;
              isAuto = true;
            }}
            aria-label="自动">自动</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              isQuick = false;
              isAuto = false;
              await waitSave();
              menuTitle = "保存";
              menuNum = 1;
            }}
            aria-label="保存">保存</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              quickSave.set($currentSave);
              isQuick = false;
            }}
            aria-label="快存">快存</button
          >
          <button
            class={`hover:text-red-300 ${$quickSave.current !== -1 ? "hover:text-red-300 text-gray-400 cursor-pointer" : "text-gray-700"}`}
            style="font-size: 1cqi;"
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if ($quickSave.current !== -1) {
                isQuick = false;
                currentSave.set($quickSave);
                ac(-1);
                next();
              }
            }}
            aria-label="快读">快读</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              isQuick = false;
              isAuto = false;
              await waitSave();
              menuTitle = "设置";
              menuNum = 3;
            }}
            aria-label="设置">设置</button
          >
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  * {
    font-size: 2cqi;
  }
</style>
