import { OpsLevelService } from "./types";
import fetch from "node-fetch";

export const transmit = async (
  CUSTOM_EVENT_WEBHOOK: string,
  data: OpsLevelService[]
): Promise<void> => {
  const endpoint = `https://app.opslevel.com/integrations/custom_event/${CUSTOM_EVENT_WEBHOOK}`;

  Promise.all(
    data.map(async (d) => {
      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(d),
        headers: {
          "content-type": "application/json",
        },
      });
    })
  );
};
