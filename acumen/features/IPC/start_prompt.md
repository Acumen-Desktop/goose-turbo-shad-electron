We are working on 'desktop/goose-desktop' (GD), which is derived from an upstream original repo here: 'goose-original/ui/desktop' (GO). Use GO as the 'source of truth', do not edit it, but use it for exact code and inspiration.

GO is a react frontend to a electron app that uses 'goose agent' (GA), which is a rust app here: 'desktop/goose-desktop/src/bin/goosed'

We have a test html page here: 'desktop/goose-desktop/src/renderer/index.html'

Let's create our first IPC test using GA. Read the existing IPC commands in preload.ts and pick the simplest one to see how we interact with GA.

The docs for goose are here: @Goose and the raw markdown docs files are here: ' goose-original/documentation/docs'

You started messing up, so here is a new session. The problem is you are being creative with your code. I want you to look at the GO code and modify it as little as possible, and use the code and logic in GD.

If GO uses a file, for example GO's logger.ts, 'goose-original/ui/desktop/src/utils/logger.ts', then we should copy the file to our project with no changes. Since GO is under active development, we want to be able to pull as much code as possible and simply replace updated GO files into GD. You re-created logger.ts 'desktop/goose-desktop/src/ipc/utils/logger.ts', which is a waste of time and source of bugs.

Start again and look how GO does the GA code and make ours match.
