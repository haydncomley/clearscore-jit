# jit - ClearScore Git CLI Tool
This is a just a simple tool for formatting and wrapping common git commands. It allows for quicker [properly formatted commits](https://www.notion.so/Branching-and-commits-78e545b9b7344347a4e866664b56e612), automated squashing (to some degree) and less busy-work.

<img width="498" alt="Screenshot 2023-01-26 at 20 37 14" src="https://user-images.githubusercontent.com/9806346/214946319-c612fe60-8278-4b71-8fea-d0c6d0793e98.png">


## Usage / Features

### Installation
1. Install: `npm i -g https://github.com/haydncomley/clearscore-jit`
2. Start: `jit`
### New Branch
> Pretty simple but just creates a branch that is already formatted based on type - useful when used later with formatted commits.

### Quick Commit
> This is also simple - it just commits current changes to your branch for testing which can be later squished.

### Formatted / PR Ready Commits
> Remembering the steps for a commit isn't hard but we're all human and forget here and there - this just automates it, formats it correctly and ships it off ready for review.

<img width="546" alt="Screenshot 2023-01-26 at 20 37 40" src="https://user-images.githubusercontent.com/9806346/215062982-ad2f9f98-f4b0-44f0-8757-08c574504df5.png">

You can add any outstanding changes, set a ticket number + package name (with validation) as well as having your commit messages formatted ready for the pre-commit hooks.

<img width="653" alt="Screenshot 2023-01-26 at 20 38 44" src="https://user-images.githubusercontent.com/9806346/215063073-52ce2280-30fa-4502-ad2e-b2a7996c46c1.png">

### Auto-Squish
> This one hopes to automate the process of squashing commits - if there are no conflicts then easy-peasy, one command and a message later you're done. If there are any conflicts just fix them up, re-run it and your should be good to go.