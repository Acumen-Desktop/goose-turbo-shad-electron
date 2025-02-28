<script lang="ts">
  import { User } from 'src/core/context/user.svelte.js';

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
      class="w-full rounded-md border p-2"
      placeholder="Name"
      required
      type="text"
      bind:value={user.name}
    />
  </div>
  <div class="space-y-2">
    <input
      name="email"
      class="w-full rounded-md border p-2"
      placeholder="Email"
      required
      type="email"
      bind:value={user.email}
    />
  </div>
</form>
