We are working on the 'desktop/goose-desktop' (GD) folder. It is a refactored version of the original repo here: 'goose-original/ui/desktop' (GO). Use GO as the 'source of truth', do not edit it. Try and copy as much backend and ai code as possible from GO, keeping the file names and relative paths the same. GO is under active development, so it must be easy to bring new code into our version. BUT, GO has all the frontend (react), backend (electron) and AI (goose) code mixed together, and we are refactoring that mess into separate frontend (svelte), backend and ai folders. Before making edits or changing/adding/deleting files, check GO for code and logic, then check our modified folder structure. Do not duplicate code in GD.

GO uses 'goose agent' (GA), which is a rust app here: 'desktop/goose-desktop/src/bin/goosed'

Our main window electron app entry/test html page here: 'desktop/goose-desktop/src/renderer/index.html'. Parent and child windows are created here: 'desktop/goose-desktop/src/main/windows/createParentWindow.ts' and 'desktop/goose-desktop/src/main/windows/createChildWindow.ts', and will use sveltekit frontends from here: 'apps'.

The docs for goose are here: @Goose and the raw markdown docs files are here: ' goose-original/documentation/docs'

Our last session was setting up our basic folder structure for GD and copying over as many backend and ai code files as possible from GO. There is no frontend code in GD except the basic index.html for testing. Double check the file structure of GO and GD so you are familiar with the matching files and paths and optimizations for refactoring. Keep GD more broken down into smaller files and folders than GO.

GD is currently started with 'yarn start' from the root terminal. The frontend is running via 'vite' at 'http://localhost:5173'. The terminal startup logs are:

IPC is broken. See how GO does IPC, review how we do our IPC, and fix it.

Expect old code and redundant files. Don't go crazy with typescript as it just make a mess in the past.

 The 'ping pong' IPC is for testing, it is not working. The issue may be with our addition of extra type safety and naming conventions, which we will keep and improve upon the orginal GO.
