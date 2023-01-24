import gitRepoInfo from "git-repo-info";

interface IGitDetails {
    branchName: string
}

export function getGitDetails(dir: string): IGitDetails | undefined  {
    const details = gitRepoInfo(dir);
    if (!details.root) return undefined;

    return {
        branchName: details.branch
    }
}