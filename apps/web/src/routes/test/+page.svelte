<script lang="ts">
	import { Button } from '@repo/ui';
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl font-bold">Testing Shadcn Button</h1>

	<div class="space-y-4">
		<div class="flex gap-4">
			<Button>Default Button</Button>
			<Button variant="destructive">Destructive Button</Button>
			<Button variant="outline">Outline Button</Button>
		</div>

		<div class="flex gap-4">
			<Button variant="secondary">Secondary Button</Button>
			<Button variant="ghost">Ghost Button</Button>
			<Button variant="link">Link Button</Button>
		</div>

		<div class="flex gap-4">
			<Button size="sm">Small Button</Button>
			<Button size="default">Default Size</Button>
			<Button size="lg">Large Button</Button>
		</div>
	</div>
</div>
