<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();
</script>

<!-- UI CODE START -->
<div class="p-12">
	<h1 class="text-2xl font-bold">Data page</h1>
	<a href="/">
		<Button class="text-white">Back to home</Button>
	</a>
	<div class="h-[500px] overflow-y-auto rounded-md bg-gray-100 p-4 shadow-md">
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</div>
</div>
