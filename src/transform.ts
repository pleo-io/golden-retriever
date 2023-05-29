import { OpsLevelService, OpsLevelServiceData } from "./types";

export const transform = (
  services: OpsLevelServiceData[]
): OpsLevelService[] => {
  const filtered: OpsLevelService[] = services.map((s) => {
    const gitHubRepositories = s.gitHubRepositories?.map((g) => {
      return {
        name: "",
        defaultBranchName: "",
        prApprovalsNeeded: 0,
        openRenovatePrs: 0,
      };
    });

    return {
      name: s.name,
      gitHubRepositories,
    };
  });

  return filtered;
};
