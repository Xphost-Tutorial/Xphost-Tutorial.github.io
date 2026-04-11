<script lang="ts">
  import { onMount } from "svelte";
  import dialog from "../../store/dialog.yml";
  import { sleep } from "../../utils";
  console.log(dialog)
  let dialogHistory = $state([]);
  let dialogCurrent = $state("");
  let numCurrent = $state(-1);
  let lockText = false;
  let exitText = false;
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
    if (lockText) {
      exitText = true;
      dialogCurrent = dialog.start[numCurrent].message;
      lockText = false;
      return;
    }
    numCurrent += 1;
    dialogCurrent = ""
    lockText = true
    const ct = dialog.start[numCurrent].message;
    let isLt = false;
    for (let i = 0; i < (ct?.length ?? 0); i++) {
      if (exitText) {
        break;
      }
      if (ct[i] === "<") {
        isLt = true;
      }
      if (ct[i] === ">") {
        isLt = false;
      }
      if (!isLt) await sleep(100 - 80);
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
    <div
      class="absolute bottom-0 flex flex-col items-center left-0 w-full min-h-[15cqi] bg-[linear-gradient(to_right,#FFFFFF77_0%,#00000077_20%,#00000077_80%,#FFFFFF77_100%)]"
    >
      <div class="flex flex-col w-3/5 h-full flex-1 items-center">
        <div class="w-full text-left">
          {@html dialog.start[numCurrent]?.name || "　"}
        </div>
        <div class="text-left px-[2cqi] w-full flex-1 *:text-white text-white" style="font-size: 1.6cqi">
          {@html dialogCurrent}
        </div>
        <div class="flex justify-center gap-[2cqi]">
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">回退</div>
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">历史</div>
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">快进</div>
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">自动</div>
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">保存</div>
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">快存</div>
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">快读</div>
          <div class="hover:text-white text-gray-400 cursor-pointer" style="font-size: 1cqi">设置</div>
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
