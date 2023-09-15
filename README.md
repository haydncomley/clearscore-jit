# jit - ClearScore Git CLI Tool
This is a just a simple tool for formatting and wrapping common git commands. It allows for quicker [properly formatted commits](https://www.notion.so/Branching-and-commits-78e545b9b7344347a4e866664b56e612), automated squashing (to some degree) and less busy-work.

<img width="498" alt="Screenshot 2023-01-26 at 20 37 14" src="https://user-images.githubusercontent.com/9806346/234021955-ed3b6122-6dc6-417b-8d71-9af4a86d2e80.png">

## Usage / Features

### Installation
1. Install: `npm install -g --save https://github.com/haydncomley/clearscore-jit/tarball/master`
2. Start: `jit`

### New Branch
> Pretty simple but just creates a branch that is already formatted based on type - useful when used later with formatted commits.

![New Branch Gif](https://user-images.githubusercontent.com/9806346/234021639-21559810-a16e-404b-af81-53bea394929a.gif)

### Quick Commit
> This is also simple - it just commits current changes to your branch for testing which can be later squished.

![Quick Commit Video](https://user-images.githubusercontent.com/9806346/234025372-b5ecc434-2a5c-406d-b80e-9bbf875e781e.gif)

### Formatted / PR Ready Commits
> Remembering the steps for a commit isn't hard but we're all human and forget here and there - this just automates it, formats it correctly and ships it off ready for review. 

![Formatted PR Video](https://user-images.githubusercontent.com/9806346/234024256-4cfec3ce-0b74-4552-81fb-fa4552bd5108.gif)

### Retrospective Commit
> Sometimes you forgot that one thing on your branch like a dependency update or a small fix - this just pulls your last commit back to staging, commits your changes and then force pushes them up to the same branch.

![Formatted PR Video](https://user-images.githubusercontent.com/9806346/234024256-4cfec3ce-0b74-4552-81fb-fa4552bd5108.gif)

### Auto-Squish
> This one hopes to automate the process of squashing commits - if there are no conflicts then easy-peasy, one command and a message later you're done. If there are any conflicts just fix them up, re-run it and your should be good to go.

![Auto Squish Video](https://user-images.githubusercontent.com/9806346/234026477-fc3ff541-0ea0-42ed-af13-2fbf2a90c6b9.gif)

