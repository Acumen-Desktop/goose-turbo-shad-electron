<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';
  import { cn } from 'src/core/utils/cn';

  let {
    ref = $bindable(null),
    class: className,
    level = 5,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  } = $props();
</script>

<div
  bind:this={ref}
  class={cn('mb-1 leading-none font-medium tracking-tight', className)}
  aria-level={level}
  role="heading"
  {...restProps}
>
  {@render children?.()}
</div>
