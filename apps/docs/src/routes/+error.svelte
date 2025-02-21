<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	// Helper to safely get the stack trace
	function getErrorStack(error: unknown): string | undefined {
		if (error instanceof Error) {
			return error.stack;
		}
		return undefined;
	}
</script>

<div class="error-container">
	<h1>Error {$page.status}</h1>
	<p>{$page.error?.message || 'An unexpected error occurred'}</p>

	{#if dev && getErrorStack($page.error)}
		<details>
			<summary>Technical details</summary>
			<pre>{getErrorStack($page.error)}</pre>
		</details>
	{/if}
</div>
