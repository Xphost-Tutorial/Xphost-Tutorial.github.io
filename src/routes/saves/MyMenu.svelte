<script lang="ts">
  import { fade } from "svelte/transition";
  import MainBack from "../../assets/backgroundImage/MainBack.webp";
  import dialog from "../../store/dialog.yml";
  import { currentSave } from "../../store";
  const { title, num, result } = $props();
  import { saveCount, saveData } from "../../utils";
  import { save } from "../../utils/backend-tauri";
  import MyMessageBox from "../../components/Svelte/MyMessageBox.svelte";
  let realTitle = $state((() => title)());
  let realNum = $state((() => num)());
  let savePage = $state(0);
  let titleMessage = $state("");
  let buttons = $state<any[]>([]);
  let resolveMessage = $state<Function>(() => {});
</script>

<div class="w-full h-full absolute top-0 left-0 z-10 flex" in:fade out:fade>
  <img
    class="absolute top-0 left-0 w-full h-full brightness-90 z-0"
    src={MainBack}
    alt="背景图片"
  />
  <div
    class="flex flex-col items-center justify-center gap-[0.6cqi] h-full w-1/4 z-1 bg-[#00000080] relative"
  >
    <div
      class="absolute top-[2cqi] text-red-500 left-0 right-0 mx-auto text-[5cqi] text-center"
    >
      {realTitle}
    </div>
    <button
      class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
      style={`${realNum === 0 ? "color: white;" : ""}`}
      aria-label="历史"
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        realNum = 0;
      }}>历史</button
    >
    <button
      class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
      style={`${realNum === 1 ? "color: white;" : ""}`}
      aria-label="保存"
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        realNum = 1;
      }}>保存</button
    >
    <button
      class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
      style={`${realNum === 2 ? "color: white;" : ""}`}
      aria-label="读取"
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        realNum = 2;
      }}>读取</button
    >
    <button
      in:fade
      out:fade
      class="text-[2cqi] text-red-500 cursor-pointer absolute bottom-[2cqi] left-0 right-0 mx-auto"
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        result();
      }}>返回</button
    >
  </div>
  <div class="flex-1 relative h-full">
    {#if realNum === 0}
      <div
        in:fade
        out:fade
        class="absolute w-full h-full top-0 left-0 bg-[#00000080]"
      >
        <div
          class="border-solid border-l-red-500 border-l-[0.3cqi] absolute w-full h-[80%] top-0 bottom-0 my-auto left-0 flex flex-col overflow-y-auto"
        >
          <div
            class="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)] shrink-0 w-full gap-[3cqi_2cqi] px-[2cqi]"
          >
            {#each new Array($currentSave.current + 1).fill(null) as _, index}
              <div class="min-h-[10cqi] text-right text-[2cqi] *:text-[2cqi]">
                {@html dialog.start[index].name}
              </div>
              <div
                class="min-h-[10cqi] *:text-white text-white text-[2cqi] *:text-[2cqi]"
              >
                {@html dialog.start[index].message}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else if realNum === 1}
      <div
        in:fade
        out:fade
        class="absolute w-full h-full top-0 left-0 bg-[#00000080]"
      >
        <div
          class="border-solid flex flex-col items-center gap-[3cqi] py-[1cqi] px-[5cqi] border-l-red-500 border-l-[0.3cqi] absolute w-full h-[80%] top-0 bottom-0 my-auto left-0"
        >
          <div class="text-red-300 text-[2cqi]">
            第 {savePage + 1} 页
          </div>
          <div
            class="min-h-0 min-w-0 grid grid-cols-3 grid-rows-2 flex-1 gap-[3cqi_2cqi] w-full"
          >
            {#each new Array(saveCount > savePage * 6 + 6 ? 6 : saveCount % 6).fill(null) as _, index}
              <div
                class="min-h-0 min-w-0 w-full h-full flex flex-col items-center gap-[1cqi]"
              >
                <button
                  class="min-h-0 min-w-0 relative w-full h-[calc(100%-1cqi)] bg-red-400 cursor-pointer hover-img"
                  onclick={async () => {
                    if (
                      $saveData.saveInstance[
                        "save" + (savePage * 6 + index + 1)
                      ]?.image
                    ) {
                      buttons = ["确认", "取消"];
                      titleMessage = "您确定要覆盖此存档吗？";
                      if (
                        await new Promise((resolve) => {
                          resolveMessage = resolve;
                        })
                      ) {
                        return;
                      }
                    }
                    save(
                      savePage * 6 + index + 1,
                      $currentSave.name,
                      $currentSave.updateTime,
                      $currentSave.current,
                      $currentSave.chapter,
                      $currentSave.image,
                      {
                        ...$currentSave,
                        name: undefined,
                        current: undefined,
                        updateTime: undefined,
                        chapter: undefined,
                        image: undefined,
                      },
                    );
                    saveData.set({
                      ...$saveData,
                      saveInstance: {
                        ...$saveData.saveInstance,
                        [`save${savePage * 6 + index + 1}`]: $currentSave,
                      },
                    });
                  }}
                  aria-label="存档点击"
                >
                  {#if $saveData.saveInstance["save" + (savePage * 6 + index + 1)]?.image}
                    <img
                      src={$saveData.saveInstance[
                        "save" + (savePage * 6 + index + 1)
                      ]?.image}
                      alt="存档图片"
                      class="w-full h-full min-h-0 min-w-0 object-fill"
                    />
                  {/if}
                </button>
                <div class="text-[1.5cqi] text-white">
                  {$saveData.saveInstance["save" + (savePage * 6 + index + 1)]
                    ?.updateTime || `空存档位${savePage * 6 + index + 1}`}
                </div>
              </div>
            {/each}
          </div>
          <div
            class="*:text-[2cqi] flex items-center justify-center gap-[1cqi]"
          >
            <button
              class="text-gray-400 hover:text-red-300 cursor-pointer"
              onclick={() => {
                if (savePage > 0) savePage -= 1;
              }}>&lt;</button
            >
            {#each new Array(Math.ceil(saveCount / 6)).fill(null) as _, index}
              <button
                class={`text-gray-400 hover:text-red-300 cursor-pointer ${savePage === index ? "text-white" : ""}`}
                onclick={() => {
                  savePage = index;
                }}>{index + 1}</button
              >
            {/each}
            <button
              class="text-gray-400 hover:text-red-300 cursor-pointer"
              onclick={() => {
                if (savePage < Math.ceil(saveCount / 6) - 1) savePage += 1;
              }}>&gt;</button
            >
          </div>
        </div>
      </div>
    {:else if realNum === 2}
      <div in:fade out:fade class="absolute w-full h-full bg-[#00000080]">
        <div
          class="border-solid flex flex-col items-center gap-[3cqi] py-[1cqi] px-[5cqi] border-l-red-500 border-l-[0.3cqi] absolute w-full h-[80%] top-0 bottom-0 my-auto left-0"
        >
          <div class="text-red-300 text-[2cqi]">
            第 {savePage + 1} 页
          </div>
          <div
            class="min-h-0 min-w-0 grid grid-cols-3 grid-rows-2 flex-1 gap-[3cqi_2cqi] w-full"
          >
            {#each new Array(saveCount > savePage * 6 + 6 ? 6 : saveCount % 6).fill(null) as _, index}
              <div
                class="min-h-0 min-w-0 w-full h-full flex flex-col items-center gap-[1cqi]"
              >
                <button
                  class={`min-h-0 min-w-0 relative w-full h-[calc(100%-1cqi)] bg-red-400 ${$saveData.saveInstance["save" + (savePage * 6 + index + 1)]?.image ? "hover-img" : ""}`}
                  onclick={() => {
                    if (
                      $saveData.saveInstance[
                        "save" + (savePage * 6 + index + 1)
                      ]?.image
                    ) {
                      currentSave.set({
                        ...$saveData.saveInstance[
                          `save${savePage * 6 + index + 1}`
                        ],
                      });
                      result(true);
                    }
                  }}
                  aria-label="存档点击"
                >
                  {#if $saveData.saveInstance["save" + (savePage * 6 + index + 1)]?.image}
                    <img
                      src={$saveData.saveInstance[
                        "save" + (savePage * 6 + index + 1)
                      ]?.image}
                      alt="存档图片"
                      class="w-full h-full min-h-0 min-w-0 object-fill"
                    />
                  {/if}
                </button>
                <div class="text-[1.5cqi] text-white">
                  {$saveData.saveInstance["save" + (savePage * 6 + index + 1)]
                    ?.updateTime || `空存档位${savePage * 6 + index + 1}`}
                </div>
              </div>
            {/each}
          </div>
          <div
            class="*:text-[2cqi] flex items-center justify-center gap-[1cqi]"
          >
            <button
              class="text-gray-400 hover:text-red-300 cursor-pointer"
              onclick={() => {
                if (savePage > 0) savePage -= 1;
              }}>&lt;</button
            >
            {#each new Array(Math.ceil(saveCount / 6)).fill(null) as _, index}
              <button
                class={`text-gray-400 hover:text-red-300 cursor-pointer ${savePage === index ? "text-white" : ""}`}
                onclick={() => {
                  savePage = index;
                }}>{index + 1}</button
              >
            {/each}
            <button
              class="text-gray-400 hover:text-red-300 cursor-pointer"
              onclick={() => {
                if (savePage < Math.ceil(saveCount / 6) - 1) savePage += 1;
              }}>&gt;</button
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
  {#if titleMessage !== ""}
    <MyMessageBox
      title={titleMessage}
      {buttons}
      result={(result = 0) => {
        titleMessage = "";
        buttons = [];
        resolveMessage(result === 1);
      }}
    ></MyMessageBox>
  {/if}
</div>

<style>
  .hover-img:hover {
    filter: brightness(1.4);
  }
  .hover-img:hover + div {
    color: oklch(80.8% 0.114 19.571);
  }
  .hover-img::before {
    content: "";
    top: 0;
    left: -0.8cqi;
    height: 100%;
    width: 0.4cqi;
    position: absolute;
  }
  .hover-img:hover::before {
    background-color: oklch(80.8% 0.114 19.571);
  }
</style>
