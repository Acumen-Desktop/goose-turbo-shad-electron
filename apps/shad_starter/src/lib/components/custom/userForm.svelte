<script lang="ts">
	import { User } from '$core/context/user.svelte.js';

	interface UserProps {
		user: User;
	}

	let { user }: UserProps = $props();
</script>

<!-- Form for user to enter name and email -->
<form class="mt-4 space-y-4">
	<div class="space-y-2">
		<input
			name="name"
			type="text"
			placeholder="Name"
			class="w-full rounded-md border p-2"
			required
			bind:value={user.name}
		/>
	</div>
	<div class="space-y-2">
		<input
			name="email"
			type="email"
			placeholder="Email"
			class="w-full rounded-md border p-2"
			required
			bind:value={user.email}
		/>
	</div>
</form>
