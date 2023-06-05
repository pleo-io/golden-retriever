import { OpsLevelService } from "./types";
import axios from "axios";

export const transmit = async (
  CUSTOM_EVENT_WEBHOOK: string,
  data: OpsLevelService[]
): Promise<void> => {
  const endpoint = `https://app.opslevel.com/integrations/custom_event/${CUSTOM_EVENT_WEBHOOK}`;

  Promise.all(
    data.map(async (d) => {
      console.info(`[POST] OpsLevel: ${JSON.stringify(d)}`);
      if (!process.env.DRY_RUN)
        axios.post(endpoint, d, {
          headers: {
            "content-type": "application/json",
          },
        });
    })
  );
};
