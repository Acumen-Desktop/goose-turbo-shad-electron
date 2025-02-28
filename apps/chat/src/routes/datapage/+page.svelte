<script lang="ts">
  import { AppButton } from 'src/components/button';
  let { data } = $props();
</script>

<!-- UI CODE START -->
<div class="p-12">
  <h1 class="text-2xl font-bold">Data page</h1>

  <a href="/">
    <AppButton class="text-white">Back to home</AppButton>
  </a>
  <div class="h-[500px] overflow-y-auto rounded-md bg-gray-100 p-4 shadow-md">
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
</div>
