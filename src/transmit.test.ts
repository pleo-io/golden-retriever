import { OpsLevelService } from "./types";
import { transmit } from "./transmit";
import { expect, test, jest, describe, beforeEach, afterEach } from "@jest/globals";


describe("Data transmission to OpsLevel", () => {
  const endpoint = "OPSLEVEL_ENDPOINT";
  const data: OpsLevelService[] = [
    {
      name: "test",
      gitHubRepositories: [
        { defaultBranchName: "main", name: "test", prApprovalsNeeded: 1 },
      ],
    },
  ];
  let axiosMock: jest.Mock

  beforeEach(function () {
    axiosMock = jest.fn().mockReturnValue(jest.fn());
    jest.mock("axios", () => {
      return {
        __esModule: true,
        post: axiosMock,
      };
    });
  })

  afterEach(() => {
    jest.clearAllMocks()
})

  test("Can transmit data to OpsLevel", async () => {
    await transmit(endpoint, data);

    expect(axiosMock).toHaveBeenCalledTimes(1);
  });

  test("Can dry-run data transmission to OpsLevel", async () => {
    process.env.DRY_RUN = "true";

    await transmit(endpoint, data);

    expect(axiosMock).toHaveBeenCalledTimes(0);
  });
});
