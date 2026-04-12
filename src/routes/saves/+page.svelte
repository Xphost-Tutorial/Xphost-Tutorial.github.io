<script lang="ts">
  import { onMount } from "svelte";
  import dialog from "../../store/dialog.yml";
  import { sleep } from "../../utils";
  import MyMenu from "./MyMenu.svelte";
  import { currentSave } from "../../store";
  import { goto } from "$app/navigation";
  let dialogCurrent = $state("");
  let lockText = false;
  let exitText = false;
  let menuNum = $state(-1);
  let menuTitle = $state("");
  let isQuick = $state(false);
  let isAuto = $state(false);
  function getCur(): number {
    return $currentSave.current;
  }
  function addCur(num: number) {
    currentSave.set({
      ...$currentSave,
      current: $currentSave.current + num,
    });
  }
  function backToMain() {
    isQuick = false;
    isAuto = false;
    goto("/");
  }
  onMount(() => {
    next();
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
  async function next() {
    isQuick = false;
    if (menuNum !== -1) {
      return;
    }
    if (lockText) {
      exitText = true;
      dialogCurrent = dialog.start[getCur()].message;
      lockText = false;
      return;
    }
    addCur(1);
    const d = dialog.start[getCur()];
    if (!d?.type) {
      backToMain();
      return;
    }
    if (d.type === "message") {
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
        if (!isLt) await sleep(100 - 80); // TODO: 设置
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
    }
  }
  function prev() {
    addCur(-1);
    if (getCur() < 0) {
      addCur(1);
      return;
    }
    const d = dialog.start[getCur()];
    if (d.type === "message") {
      dialogCurrent = d.message;
      exitText = true;
    } else {
      prev();
    }
  }
  setInterval(() => {
    if (isQuick) {
      addCur(1);
      const d = dialog.start[getCur()];
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
  }, 5000); // TODO: 设置
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
      <MyMenu title={menuTitle} num={menuNum} result={() => (menuNum = -1)}
      ></MyMenu>
    {/if}
    <div
      class="absolute bottom-0 flex flex-col items-center left-0 w-full min-h-[15cqi] bg-[linear-gradient(to_right,#FFFFFF77_0%,#00000077_20%,#00000077_80%,#FFFFFF77_100%)]"
    >
      <div class="flex flex-col w-3/5 h-full flex-1 items-center">
        <div class="w-full text-left">
          {@html dialog.start[getCur()]?.name || "　"}
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
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isQuick = false;
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
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="保存">保存</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="快存">快存</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="快读">快读</button
          >
          <button
            class="hover:text-red-300 text-gray-400 cursor-pointer"
            style="font-size: 1cqi"
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
