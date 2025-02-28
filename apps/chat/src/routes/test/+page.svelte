<script lang="ts">
  import { User } from 'src/core/context/user.svelte';
  import Photo from 'src/components/custom/Photo.svelte';
  import UserForm from 'src/components/custom/UserForm.svelte';
  import { AppButton } from 'src/components/button';
  import { AppAlert } from 'src/components/alert';
  import { AppDialog } from 'src/components/dialog/index.js';

  const { data } = $props();

  let fetchedData = $state(data);
  let loading = $state(false);
  const user = $derived(new User('', ''));

  async function refreshData() {
    loading = true;
    const response = await fetch('https://api.restful-api.dev/objects/7');
    fetchedData = await response.json();
    loading = false;
  }
</script>

<!-- UI CODE START -->
<div class="w-full p-12">
  <div class="flex w-full flex-col space-y-6">
    <!-- Header section -->
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold">Home page</h1>
      <AppButton class="text-white" disabled={loading} onclick={() => refreshData()}>
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </AppButton>
      <a href="/datapage">
        <AppButton class="w-full text-white">
          Browse to page that fetches data on hover of this button
        </AppButton>
      </a>
    </div>

    <!-- Main content section -->
    <div class="flex w-full gap-6">
      <!-- Left column -->
      <div class="flex w-1/2 flex-col gap-6">
        <div class="h-[500px] w-full overflow-y-auto rounded-md bg-gray-100 p-4 shadow-md">
          <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
        </div>
      </div>

      <!-- Right column -->
      <div class="flex w-1/2 flex-col">
        <h3 class="text-lg font-bold">Reactive state example</h3>
        <p class="text text-gray-500">
          Changing the user details inside the UserForm component will update the user details on
          the home page (+page.svelte)
        </p>
        <div class="w-full">
          <UserForm {user} />
        </div>

        {#if user.name || user.email}
          <div class="mt-4 w-full rounded-md bg-white p-4 shadow">
            <h2 class="mb-2 text-xl font-semibold">User Details</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        {/if}
      </div>
    </div>
    <div class="flex w-1/2 flex-col">
      <AppAlert.Root variant="destructive">
        <AppAlert.Title>🥳 This is an alert</AppAlert.Title>
        <AppAlert.Description>
          <p>This is an alert description</p>
        </AppAlert.Description>
      </AppAlert.Root>
    </div>
    <Photo />
    <div class="flex w-1/2 flex-col">
      <AppDialog.Root>
        <AppDialog.Trigger>
          <AppButton>Open Dialog</AppButton>
        </AppDialog.Trigger>
        <AppDialog.Content>
          <AppDialog.Header>
            <AppDialog.Title>Are you sure absolutely sure?</AppDialog.Title>
            <AppDialog.Description>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AppDialog.Description>
          </AppDialog.Header>
        </AppDialog.Content>
      </AppDialog.Root>
    </div>
  </div>
</div>
