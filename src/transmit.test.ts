import { OpsLevelService } from "./types";
import { transmit } from "./transmit";
import { expect, test, describe, beforeEach } from "@jest/globals";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const endpoint = "OPSLEVEL_ENDPOINT";
const data: OpsLevelService[] = [
  {
    name: "test",
    gitHubRepositories: [
      { defaultBranchName: "main", name: "test", prApprovalsNeeded: 1 },
    ],
  },
];

const mock = new MockAdapter(axios);
mock.onPost().reply(200);

describe("Data transmission to OpsLevel", () => {
  beforeEach(() => {
    mock.resetHistory();
  });

  test("Can transmit data to OpsLevel", async () => {
    await transmit(endpoint, data);

    expect(mock.history["post"].length).toEqual(1);
  });

  test("Can dry-run data transmission to OpsLevel", async () => {
    process.env.DRY_RUN = "true";

    await transmit(endpoint, data);

    expect(mock.history["post"].length).toEqual(0);
  });
});
