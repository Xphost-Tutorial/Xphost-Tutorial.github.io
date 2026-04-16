<script lang="ts">
    const { title, buttons, result } = $props();
</script>

<div
    class="absolute w-full h-full top-0 left-0 bg-[#00000080] z-100 flex items-center justify-center"
>
    <div
        class="w-auto h-auto p-[4cqi] flex flex-col gap-[3cqi] bg-black border-[0.5cqi] border-solid border-red-400"
    >
        <div class="text-[2cqi] text-white text-center">{@html title}</div>
        <div class="flex w-full justify-between">
            {#each buttons as button, index}
                <button
                    class="text-[2cqi] text-gray-500 hover:text-red-300 cursor-pointer"
                    onclick={() => {
                        result(index);
                    }}
                    aria-label={button}>{button}</button
                >
            {/each}
        </div>
    </div>
</div>
