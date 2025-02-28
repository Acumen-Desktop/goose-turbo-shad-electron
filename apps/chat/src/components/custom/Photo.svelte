<script lang="ts">
  import { Loader2 } from 'lucide-svelte';
  import Button from 'src/components/button/Button.svelte';

  let src = 'https://picsum.photos/200/300';
  let alt = 'random photo';
  let isLoading = false;

  async function updatePhoto() {
    isLoading = true;
    src = `https://picsum.photos/200/300?t=${Date.now()}`;
    alt = 'random photo';
  }

  function onLoad() {
    isLoading = false;
  }
</script>

<div class="flex w-fit flex-col gap-2">
  <div class="h-[300px] w-[200px]">
    {#if isLoading}
      <div class="h-full w-full animate-pulse rounded-md bg-gray-200"></div>
    {/if}
    <img class="h-full w-full object-cover" class:hidden={isLoading} {alt} {src} on:load={onLoad} />
  </div>
  <Button onclick={updatePhoto}>
    {#if isLoading}
      Update Photo <Loader2 class="h-4 w-4 animate-spin" />
    {:else}
      Update Photo
    {/if}
  </Button>
</div>
