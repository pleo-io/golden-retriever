export interface GitHubRepository {
  name: string;
  defaultBranchName: string;
  prApprovalsNeeded?: number;
  openRenovatePrs?: number;
}

export interface OpsLevelService {
  name: string;
  gitHubRepositories?: GitHubRepository[];
}
