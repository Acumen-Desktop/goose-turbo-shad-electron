import { Dialog as DialogPrimitive } from 'bits-ui';

import Title from './DialogTitle.svelte';
import Footer from './DialogFooter.svelte';
import Header from './DialogHeader.svelte';
import Overlay from './DialogOverlay.svelte';
import Content from './DialogContent.svelte';
import Description from './DialogDescription.svelte';

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;
const Portal = DialogPrimitive.Portal;

export const AppDialog = {
  Root,
  Title,
  Portal,
  Footer,
  Header,
  Trigger,
  Overlay,
  Content,
  Description,
  Close,
};
