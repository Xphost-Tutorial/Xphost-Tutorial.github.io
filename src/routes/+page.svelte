<script lang="ts">
  import "../styles/tailwind.css";
  import "../styles/index.css";
  import "../components/lit/MyComponents";
  import { fade } from "svelte/transition";
  import MainBack from "../assets/backgroundImage/MainBack.webp";
  import {
    closeWindow,
    init,
    updateGlobal,
    openUrl,
    requestFullscreen,
    exitFullscreen,
  } from "../utils/backend-tauri";
  import { onMount } from "svelte";
  import { currentSave, gallerys } from "../store/index";
  import { saveCount, saveData, sleep } from "../utils";
  import { goto } from "$app/navigation";
  let shows = $state(0);
  let title = $state("");
  let help = $state(0);
  let galleryPage = $state(0);
  let galleryClick = $state("");
  let galleryCurrent = $state(0);
  let savePage = $state(0);
  function sendGalleryLock() {
    Object.keys($gallerys).forEach((key) => {
      if ($saveData.gallery[key]) {
        gallerys.set({
          ...$gallerys,
          [key]: {
            ...$gallerys[key],
            lock: true,
          },
        });
      }
    });
  }
  onMount(async () => {
    await init();
    sendGalleryLock();
    if ($saveData.global!.isFullscreen === "1") {
      requestFullscreen();
    }
  });
</script>

<main class="fixed top-0 left-0 w-screen h-screen">
  <div
    class="@container flex aspect-video max-w-screen max-h-screen absolute left-0 right-0 top-0 bottom-0 m-auto bg-[#220000]"
  >
    <img
      class="absolute top-0 left-0 w-full h-full brightness-90 z-0"
      src={MainBack}
      alt="背景图片"
    />
    <div
      class="flex flex-col items-center justify-center gap-[0.6cqi] h-full w-1/4 z-1 bg-[#00000080] relative"
    >
      {#if title !== ""}
        <div
          in:fade
          out:fade
          class="absolute top-[2cqi] text-red-500 left-0 right-0 mx-auto text-[5cqi] text-center"
        >
          {title}
        </div>
      {/if}
      <button
        class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
        onclick={() => {
          currentSave.set({
            current: -1,
            name: "",
            updateTime: "",
            chapter: 0,
            image: "",
          });
          goto("/saves");
        }}>开始</button
      >
      <button
        class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
        style={`${shows === 1 ? "color: white;" : ""}`}
        onclick={() => {
          title = "读取";
          shows = 1;
        }}>读取</button
      >
      <button
        class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
        style={`${shows === 2 ? "color: white;" : ""}`}
        onclick={() => {
          title = "画廊";
          shows = 2;
        }}>画廊</button
      >
      <button
        class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
        style={`${shows === 3 ? "color: white;" : ""}`}
        onclick={() => {
          title = "设置";
          shows = 3;
        }}>设置</button
      >
      <button
        class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
        style={`${shows === 4 ? "color: white;" : ""}`}
        onclick={() => {
          title = "关于";
          shows = 4;
        }}>关于</button
      >
      <button
        class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
        style={`${shows === 5 ? "color: white;" : ""}`}
        onclick={() => {
          title = "帮助";
          shows = 5;
        }}>帮助</button
      >
      <button
        class="text-[2cqi] text-gray-500 cursor-pointer hover:text-red-300"
        onclick={() => {
          closeWindow();
        }}
      >
        退出
      </button>
      {#if title !== ""}
        <button
          in:fade
          out:fade
          class="text-[2cqi] text-gray-500 cursor-pointer absolute bottom-[2cqi] left-0 right-0 mx-auto hover:text-red-300"
          onclick={() => {
            title = "";
            shows = 0;
          }}
        >
          返回
        </button>
      {/if}
    </div>
    <div class="flex-1 relative h-full">
      {#if shows === 0}
        <div
          in:fade
          out:fade
          class="absolute w-full h-full border-solid border-l-red-500 border-l-[0.3cqi]"
        >
          <div
            class="absolute bottom-[2cqi] right-[2cqi] flex flex-col items-end"
          >
            <div class="text-red-500 text-[5cqi]">我的教程</div>
            <div class="text-red-500 text-[5cqi]">{__APP_VERSION__}</div>
          </div>
        </div>
      {:else if shows === 1}
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
                        goto("/saves");
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
      {:else if shows === 2}
        <div in:fade out:fade class="absolute w-full h-full bg-[#00000080]">
          <div
            class="border-solid flex flex-col items-center gap-[3cqi] py-[1cqi] px-[5cqi] border-l-red-500 border-l-[0.3cqi] absolute w-full h-[80%] top-0 bottom-0 my-auto left-0"
          >
            <div class="text-red-300 text-[2cqi]">
              第 {galleryPage + 1} 页
            </div>
            <div
              class="min-h-0 min-w-0 grid grid-cols-3 grid-rows-2 flex-1 gap-[3cqi_2cqi] w-full"
            >
              {#each Object.keys($gallerys).filter((_, index) => index >= galleryPage * 6 && index < galleryPage * 6 + 6) as key}
                <div
                  class="min-h-0 min-w-0 w-full h-full flex flex-col items-center gap-[1cqi]"
                >
                  <button
                    class={`min-h-0 min-w-0 relative w-full h-[calc(100%-1cqi)] bg-red-400 ${$gallerys[key].lock ? "hover-img" : ""}`}
                    onclick={() => {
                      if ($gallerys[key].lock) {
                        galleryClick = key;
                      }
                    }}
                    aria-label="画廊点击"
                  >
                    {#if $gallerys[key].lock}
                      <img
                        src={$gallerys[key].gallery[0]}
                        alt="画廊图片"
                        class="w-full h-full min-h-0 min-w-0 object-fill"
                      />
                    {/if}
                  </button>
                  <div class="text-[1.5cqi] text-white">{key}</div>
                </div>
              {/each}
            </div>
            <div
              class="*:text-[2cqi] flex items-center justify-center gap-[1cqi]"
            >
              <button
                class="text-gray-400 hover:text-red-300 cursor-pointer"
                onclick={() => {
                  if (galleryPage > 0) galleryPage -= 1;
                }}>&lt;</button
              >
              {#each new Array(Math.ceil(Object.keys($gallerys).length / 6)).fill(null) as _, index}
                <button
                  class={`text-gray-400 hover:text-red-300 cursor-pointer ${galleryPage === index ? "text-white" : ""}`}
                  onclick={() => {
                    galleryPage = index;
                  }}>{index + 1}</button
                >
              {/each}
              <button
                class="text-gray-400 hover:text-red-300 cursor-pointer"
                onclick={() => {
                  if (galleryPage < Math.ceil($gallerys.length / 6) - 1)
                    galleryPage += 1;
                }}>&gt;</button
              >
            </div>
          </div>
        </div>
      {:else if shows === 3}
        <div in:fade out:fade class="absolute w-full h-full bg-[#00000080]">
          <div
            class="border-solid grid grid-cols-2 grid-rows-[minmax(0,1fr)_minmax(0,2fr)] gap-[2cqi_5cqi] border-l-red-500 border-l-[0.3cqi] absolute w-full h-[80%] top-0 bottom-0 my-auto left-0 px-[3cqi] py-[1.5cqi] *:text-white text-white text-[1.5cqi] *:text-[1.5cqi]"
          >
            <div class="flex justify-between items-start">
              <div class="flex flex-col">
                <div class="text-red-500">显示</div>
                <button
                  class={`text-gray-500 text-left hover:text-red-300 ml-[1cqi] ${$saveData.global?.isFullscreen === "0" ? "highlightText" : "cursor-pointer"}`}
                  onclick={() => {
                    if ($saveData.global!.isFullscreen !== "0") {
                      saveData.set({
                        ...$saveData,
                        global: {
                          ...$saveData.global,
                          isFullscreen: "0",
                        },
                      });
                      updateGlobal("isFullscreen", "0");
                      exitFullscreen();
                    }
                  }}
                >
                  窗口
                </button>
                <button
                  class={`text-gray-500 text-left hover:text-red-300 ml-[1cqi] ${$saveData.global?.isFullscreen === "1" ? "highlightText" : "cursor-pointer"}`}
                  onclick={() => {
                    if ($saveData.global!.isFullscreen !== "1") {
                      saveData.set({
                        ...$saveData,
                        global: {
                          ...$saveData.global,
                          isFullscreen: "1",
                        },
                      });
                      updateGlobal(
                        "isFullscreen",
                        $saveData.global!.isFullscreen,
                      );
                      requestFullscreen();
                    }
                  }}
                >
                  全屏
                </button>
              </div>
              <div class="flex flex-col">
                <div class="text-red-500">快进</div>
                <button
                  class={`text-gray-500 text-left hover:text-red-300 ml-[1cqi] cursor-pointer ${$saveData.global?.notReadText === "1" ? "highlightText" : ""}`}
                  onclick={() => {
                    saveData.set({
                      ...$saveData,
                      global: {
                        ...$saveData.global,
                        notReadText:
                          $saveData.global.notReadText === "1" ? "0" : "1",
                      },
                    });
                    updateGlobal("notReadText", $saveData.global.notReadText);
                  }}
                >
                  未读文本
                </button>
                <button
                  class={`text-gray-500 text-left hover:text-red-300 ml-[1cqi] cursor-pointer ${$saveData.global?.choiceContinue === "1" ? "highlightText" : ""}`}
                  onclick={() => {
                    saveData.set({
                      ...$saveData,
                      global: {
                        ...$saveData.global,
                        choiceContinue:
                          $saveData.global.choiceContinue === "1" ? "0" : "1",
                      },
                    });
                    updateGlobal(
                      "choiceContinue",
                      $saveData.global.choiceContinue,
                    );
                  }}
                >
                  选项后继续
                </button>
                <button
                  class={`text-gray-500 text-left hover:text-red-300 ml-[1cqi] cursor-pointer ${$saveData.global?.ignoreScene === "1" ? "highlightText" : ""}`}
                  onclick={() => {
                    saveData.set({
                      ...$saveData,
                      global: {
                        ...$saveData.global,
                        ignoreScene:
                          $saveData.global.ignoreScene === "1" ? "0" : "1",
                      },
                    });
                    updateGlobal("ignoreScene", $saveData.global.ignoreScene);
                  }}
                >
                  忽略转场
                </button>
              </div>
            </div>
            <div></div>
            <div class="flex flex-col items-start gap-[1cqi]">
              <div class="text-red-500">文字速度</div>
              <input
                type="range"
                id="textspeed"
                class="w-full h-[1cqi]"
                name="textspeed"
                min="0"
                max="100"
                value={Number($saveData.global?.textSpeed ?? "0")}
                onchange={(e) => {
                  const value = e.target.value;
                  saveData.set({
                    ...$saveData,
                    global: {
                      ...$saveData.global,
                      textSpeed: value,
                    },
                  });
                  updateGlobal("textSpeed", $saveData.global.textSpeed);
                }}
              />
              <div class="text-red-500">自动前进时间</div>
              <input
                type="range"
                id="autoSpeed"
                class="w-full h-[1cqi]"
                name="autoSpeed"
                min="0"
                max="100"
                value={Number($saveData.global?.autoSpeed ?? "0")}
                onchange={(e) => {
                  const value = e.target.value;
                  saveData.set({
                    ...$saveData,
                    global: {
                      ...$saveData.global,
                      autoSpeed: value,
                    },
                  });
                  updateGlobal("autoSpeed", $saveData.global.autoSpeed);
                }}
              />
            </div>
            <div class="flex flex-col items-start gap-[1cqi]">
              <div class="text-red-500">音乐音量</div>
              <input
                type="range"
                id="musicVolumn"
                class="w-full h-[1cqi]"
                name="musicVolumn"
                min="0"
                max="100"
                value={Number($saveData.global?.musicVolumn ?? "0")}
                onchange={(e) => {
                  const value = e.target.value;
                  saveData.set({
                    ...$saveData,
                    global: {
                      ...$saveData.global,
                      musicVolumn: value,
                    },
                  });
                  updateGlobal("musicVolumn", $saveData.global.musicVolumn);
                }}
              />
              <div class="text-red-500">音效音量</div>
              <input
                type="range"
                id="soundVolumn"
                class="w-full h-[1cqi]"
                name="soundVolumn"
                min="0"
                max="100"
                value={Number($saveData.global?.soundVolumn ?? "0")}
                onchange={(e) => {
                  const value = e.target.value;
                  saveData.set({
                    ...$saveData,
                    global: {
                      ...$saveData.global,
                      soundVolumn: value,
                    },
                  });
                  updateGlobal("soundVolumn", $saveData.global.soundVolumn);
                }}
              />
              <div class="text-red-500">语音音量</div>
              <input
                type="range"
                id="voiceVolumn"
                class="w-full h-[1cqi]"
                name="voiceVolumn"
                min="0"
                max="100"
                value={Number($saveData.global?.voiceVolumn ?? "0")}
                onchange={(e) => {
                  const value = e.target.value;
                  saveData.set({
                    ...$saveData,
                    global: {
                      ...$saveData.global,
                      voiceVolumn: value,
                    },
                  });
                  updateGlobal("voiceVolumn", $saveData.global.voiceVolumn);
                }}
              />
              <button
                class="text-gray-500 text-left hover:text-red-300 ml-[1.5cqi] cursor-pointer"
                onclick={() => {
                  saveData.set({
                    ...$saveData,
                    global: {
                      ...$saveData.global,
                      voiceVolumn: "0",
                      soundVolumn: "0",
                      musicVolumn: "0",
                    },
                  });
                  updateGlobal("voiceVolumn", $saveData.global.voiceVolumn);
                  updateGlobal("soundVolumn", $saveData.global.voiceVolumn);
                  updateGlobal("musicVolumn", $saveData.global.voiceVolumn);
                }}
              >
                全部静音
              </button>
            </div>
          </div>
        </div>
      {:else if shows === 4}
        <div in:fade out:fade class="absolute w-full h-full bg-[#00000080]">
          <div
            class="border-solid border-l-red-500 border-l-[0.3cqi] absolute w-full h-[80%] top-0 bottom-0 my-auto left-0 overflow-y-auto px-[3cqi] py-[1.5cqi] *:text-white text-white text-[1.5cqi] *:text-[1.5cqi]"
          >
            <span style="color: red;">Tutorial Visual Novel</span><br />
            版本 {__APP_VERSION__}<br /><br /><br />
            <b>我的教程/My Tutorial Visual Novel</b><br /><br />
            来自 xphost 的前端视觉小说教程！<br /><br />
            本作品由 xphost 激情创作~<br /><br />
            <b>制作组</b><br />
            - 全案策划 / 程序 / 剧本：xphost<br /><br />
            <b>美术资源</b><br />
            - 暂无<br /><br />
            <b>特别鸣谢</b><br />
            - 暂无<br /><br /><br /><br />
            引擎：<button
              style="color: red;"
              class="cursor-pointer"
              onclick={() => {
                openUrl("https://tauri.app");
              }}>Tauri</button
            >
            2.10.1<br /><br />
            本程序包含了。。
          </div>
        </div>
      {:else if shows === 5}
        <div in:fade out:fade class="absolute w-full h-full bg-[#00000080]">
          <div
            class="border-solid border-l-red-500 border-l-[0.3cqi] absolute w-full h-[80%] top-0 bottom-0 my-auto left-0 flex flex-col items-center gap-[2cqi] overflow-y-auto"
          >
            <div
              class="w-full text-[2cqi] flex items-center justify-start pl-[3cqi] gap-[2cqi]"
            >
              <button
                aria-label="键盘"
                class={`text-[2cqi] cursor-pointer ${help === 0 ? "text-white" : "text-gray-500"}`}
                onclick={() => {
                  help = 0;
                }}>键盘</button
              >
              <button
                aria-label="键盘"
                class={`text-[2cqi] cursor-pointer ${help === 1 ? "text-white" : "text-gray-500"}`}
                onclick={() => {
                  help = 1;
                }}>鼠标</button
              >
            </div>
            <div
              class="grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-[1cqi_1.5cqi] *:odd:text-red-500 *:even:text-white *:odd:text-right *:text-[1.5cqi]"
            >
              {#if help === 0}
                <div>回车</div>
                <div>推进对话并激活页面。</div>
                <div>空格</div>
                <div>在没有选择的情况下推进对话。</div>
                <div>方向键</div>
                <div>导航界面。</div>
                <div>ESC</div>
                <div>访问游戏菜单。</div>
                <div>键盘</div>
                <div>按住时快进对话。</div>
                <div>Tab</div>
                <div>切换对话快进。</div>
                <div>上一页</div>
                <div>回退至先前的对话。</div>
                <div>下一页</div>
                <div>向前至后来的对话。</div>
                <div>H</div>
                <div>隐藏用户界面。</div>
                <div>S</div>
                <div>截图。</div>
                <div>V</div>
                <div>切换辅助机器朗读。</div>
                <div>Shift+A</div>
                <div>打开无障碍菜单。</div>
              {:else if help === 1}
                <div>左键点击</div>
                <div>推进对话并激活界面。</div>
                <div>中键点击</div>
                <div>隐藏用户界面。</div>
                <div>右键点击</div>
                <div>访问游戏菜单。</div>
                <div>鼠标滚轮上</div>
                <div>回退至先前的对话。</div>
                <div>鼠标滚轮下</div>
                <div>向前至后来的对话。</div>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
    {#if galleryClick !== "" || galleryCurrent > 0}
      <div class="size-full absolute top-0 left-0 z-9 bg-black"></div>
    {/if}
    {#if galleryClick !== ""}
      <button
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 200 }}
        aria-label="画廊点击"
        onclick={async () => {
          let temp = galleryClick;
          galleryClick = "";
          await sleep(10);
          galleryCurrent += 1;
          galleryClick = temp;
          if (galleryCurrent >= $gallerys[galleryClick].gallery.length) {
            galleryClick = "";
            galleryCurrent = 0;
          }
        }}
        class="size-full absolute top-0 left-0 z-10"
      >
        <img
          src={$gallerys[galleryClick].gallery[galleryCurrent]}
          alt="画廊图片"
          class="size-full"
        />
      </button>
    {/if}
  </div>
</main>

<style>
  .hover-img {
    cursor: pointer;
  }
  .hover-img:hover {
    filter: brightness(140%);
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
  .highlightText {
    color: white !important;
    position: relative;
  }
  .highlightText::before {
    position: absolute;
    content: "";
    height: 80%;
    left: -0.8cqi;
    top: 10%;
    width: 0.4cqi;
    background-color: oklch(80.8% 0.114 19.571);
  }
</style>
