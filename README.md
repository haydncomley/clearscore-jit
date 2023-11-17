# jit - ClearScore Git CLI Tool
This is a just a simple tool for formatting and wrapping common git commands. It allows for quicker properly formatted commits, automated squashing (to some degree) and less busy-work.

<img width="498" alt="Splash Screen Image" src="https://github.com/haydncomley/clearscore-jit/assets/9806346/0c5d4176-c53b-48d4-9788-5d651b349746">

## Usage / Features

### Installation
1. Install: `npm install -g --save https://github.com/haydncomley/clearscore-jit/tarball/master`
2. Start: `jit`

### New Branch
> Pretty simple but just creates a branch that is already formatted based on type - useful when used later with formatted commits.

![new-branch](https://github.com/haydncomley/clearscore-jit/assets/9806346/5a425169-ba00-435c-86a5-ea5bdbd7a7fc)

### Formatted / PR Ready Commits
> Remembering the steps for a commit isn't hard but we're all human and forget here and there - this just automates it, formats it correctly and ships it off ready for review (plus you can just paste in a jira ticket URL which makes life way easier). 

![formatted-commit](https://github.com/haydncomley/clearscore-jit/assets/9806346/27ca38aa-df45-4f68-b51e-88aa7e3eec34)

### Dev / Quick Commit
> This is also simple - it just commits current changes to your branch for testing which can be later squished.

![dev-commit](https://github.com/haydncomley/clearscore-jit/assets/9806346/d3257933-3980-4c28-b03d-032610039a8c)

### Retrospective Commit
> Sometimes you forgot that one thing on your branch like a dependency update or a small fix - this just pulls your last commit back to staging, commits your changes and then force pushes them up to the same branch.

![retro-commit](https://github.com/haydncomley/clearscore-jit/assets/9806346/23cea0df-92e0-4b8e-af46-a4428c94fcb1)

### Auto-Squish
> This one hopes to automate the process of squashing commits - if there are no conflicts then easy-peasy, one command and a message later you're done. If there are any conflicts just fix them up, re-run it and your should be good to go.

![squish](https://github.com/haydncomley/clearscore-jit/assets/9806346/780674f9-949d-40d5-ae15-acc3560b5ec3)

### Reset Master
> Just quickly hop back to the master branch while keeping your changes in the staging area.
> 
![reset-local](https://github.com/haydncomley/clearscore-jit/assets/9806346/ccb47051-5468-409b-b99e-081990aa1ff9)
