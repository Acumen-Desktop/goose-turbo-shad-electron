<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import { cn } from 'src/core/utils/cn';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
  class={cn('text-muted-foreground text-sm', className)}
  bind:ref
  {...restProps}
/>
