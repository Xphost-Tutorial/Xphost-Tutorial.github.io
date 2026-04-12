<script lang="ts">
  import { fade } from "svelte/transition";
  import MainBack from "../../assets/backgroundImage/MainBack.webp";
  import dialog from "../../store/dialog.yml";
  import { currentSave } from "../../store";
  const { title, num, result } = $props();
  let realTitle = $state((() => title)());
  let realNum = $state((() => num)());
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
      in:fade
      out:fade
      class="text-[2cqi] text-red-500 cursor-pointer absolute bottom-[2cqi] left-0 right-0 mx-auto"
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        result();
      }}
    >
      返回
    </button>
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
            {#each (new Array($currentSave.current + 1)).fill(null) as _, index}
              <div class="min-h-[10cqi] text-right text-[2cqi] *:text-[2cqi]">
                {@html dialog.start[index].name}
              </div>
              <div class="min-h-[10cqi] *:text-white text-white text-[2cqi] *:text-[2cqi]">
                {@html dialog.start[index].message}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
