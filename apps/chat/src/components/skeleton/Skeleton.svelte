<script lang="ts">
  import type { WithElementRef, WithoutChildren } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'src/core/utils/cn';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<div
  bind:this={ref}
  class={cn('bg-muted animate-pulse rounded-md', className)}
  {...restProps}
></div>
