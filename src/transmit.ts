import { OpsLevelService } from "./types";

export const transmit = async (
  CUSTOM_EVENT_WEBHOOK: string,
  data: OpsLevelService[]
): Promise<void> => {
  const fetch = await import("node-fetch");
  const endpoint = `https://app.opslevel.com/integrations/custom_event/${CUSTOM_EVENT_WEBHOOK}`;

  Promise.all(
    data.map(async (d) => {
      console.info(`[POST] OpsLevel: ${JSON.stringify(d)}`);
      if (!process.env.DRY_RUN)
        fetch.default(endpoint, {
          method: "POST",
          body: JSON.stringify(d),
          headers: {
            "content-type": "application/json",
          },
        });
    })
  );
};
