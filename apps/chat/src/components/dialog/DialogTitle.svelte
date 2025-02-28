<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import { cn } from 'src/core/utils/cn';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
  class={cn('text-lg leading-none font-semibold tracking-tight', className)}
  bind:ref
  {...restProps}
/>
