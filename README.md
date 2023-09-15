# jit - ClearScore Git CLI Tool
This is a just a simple tool for formatting and wrapping common git commands. It allows for quicker [properly formatted commits](https://www.notion.so/Branching-and-commits-78e545b9b7344347a4e866664b56e612), automated squashing (to some degree) and less busy-work.

<img width="498" alt="Splash Screen Image" src="https://github.com/haydncomley/clearscore-jit/assets/9806346/0c4de329-eb63-4442-982e-2e39be59f172">

## Usage / Features

### Installation
1. Install: `npm install -g --save https://github.com/haydncomley/clearscore-jit/tarball/master`
2. Start: `jit`

### New Branch
> Pretty simple but just creates a branch that is already formatted based on type - useful when used later with formatted commits.

![new-branch](https://github.com/haydncomley/clearscore-jit/assets/9806346/3f2cacf5-8947-4edc-bc4f-2866b13e1cf2)

### Formatted / PR Ready Commits
> Remembering the steps for a commit isn't hard but we're all human and forget here and there - this just automates it, formats it correctly and ships it off ready for review (plus you can just paste in a jira ticket URL which makes life way easier). 

![formatted-commit](https://github.com/haydncomley/clearscore-jit/assets/9806346/f810ca18-bed9-4c0d-82f8-b0a2d353d01f)

### Quick Commit
> This is also simple - it just commits current changes to your branch for testing which can be later squished.

![quick-commit](https://github.com/haydncomley/clearscore-jit/assets/9806346/0618a046-8c09-4363-be2a-bc942cdaaff5)

### Retrospective Commit
> Sometimes you forgot that one thing on your branch like a dependency update or a small fix - this just pulls your last commit back to staging, commits your changes and then force pushes them up to the same branch.

![commit-retro](https://github.com/haydncomley/clearscore-jit/assets/9806346/2ec9791f-9179-4b25-8e24-d64847a1d8b7)

### Auto-Squish
> This one hopes to automate the process of squashing commits - if there are no conflicts then easy-peasy, one command and a message later you're done. If there are any conflicts just fix them up, re-run it and your should be good to go.

![Auto Squish Video](https://user-images.githubusercontent.com/9806346/234026477-fc3ff541-0ea0-42ed-af13-2fbf2a90c6b9.gif)

### Reset Master
> Just quickly hop back to the master branch while keeping your changes in the staging area. 

![reset-master](https://github.com/haydncomley/clearscore-jit/assets/9806346/24fe3da2-6a42-40c0-a3b0-70a1e8e35211)
