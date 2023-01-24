import { getGitDetails } from './git';
import { askQuestions, whichCommitType, whichDevelopmentStage, whichDir, whichJiraTicket, whichPackageName } from './questions';

async function run() {
    const gitDetails = getGitDetails(process.cwd());
    console.log(gitDetails);


    
    const responses = await askQuestions([
        whichDevelopmentStage(),
        whichCommitType(),
        whichPackageName(),
        whichJiraTicket(),
        whichDir()
    ]);
    console.log(responses);
}

run();