import { OpsLevelService } from "./types";
import axios from "axios";
import { transmit } from "./transmit";
import { describe } from "node:test";
import { expect, test, jest } from "@jest/globals";

const endpoint = "OPSLEVEL_ENDPOINT";
const data: OpsLevelService[] = [
  {
    name: "test",
    gitHubRepositories: [
      { defaultBranchName: "main", name: "test", prApprovalsNeeded: 1 },
    ],
  },
];

const postMock = jest.fn();
jest.mock("axios", () => {
  return {
    __esModule: true,
    post: postMock,
  };
});

describe("Data transmission to OpsLevel", () => {
  test("Can transmit data to OpsLevel", async () => {
    await transmit(endpoint, data);

    expect(postMock).toHaveBeenCalledTimes(1);
  });

  test("Can dry-run data transmission to OpsLevel", async () => {
    process.env.DRY_RUN = "true";

    await transmit(endpoint, data);

    expect(postMock).toHaveBeenCalledTimes(0);
  });
});
