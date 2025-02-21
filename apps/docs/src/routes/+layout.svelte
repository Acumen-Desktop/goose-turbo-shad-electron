<!-- Root layout with error handling -->
<script lang="ts">
	import '../app.css';
	import { dev } from '$app/environment';
</script>

<slot />

<style>
	:global(.error-container) {
		padding: 2rem;
		max-width: 80ch;
		margin: 0 auto;
	}
	:global(.error-container pre) {
		white-space: pre-wrap;
		background: #f8f8f8;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
	}
	:global(.error-container details) {
		margin-top: 1rem;
	}
	:global(.error-container summary) {
		cursor: pointer;
	}
</style>
