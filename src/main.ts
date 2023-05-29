import {
  retrieveOpsLevelRepositories,
  retrieveGitHubRepositories,
} from "./retrieve";
import { transform } from "./transform";
import { transmit } from "./transmit";

const OPSLEVEL_TOKEN = process.env.OPSLEVEL_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORGANIZATION = process.env.GITHUB_ORGANIZATION;
const OPSLEVEL_CUSTOM_EVENT_WEBHOOK = process.env.OPSLEVEL_CUSTOM_EVENT_WEBHOOK;

if (
  !(
    OPSLEVEL_TOKEN &&
    GITHUB_TOKEN &&
    GITHUB_ORGANIZATION &&
    OPSLEVEL_CUSTOM_EVENT_WEBHOOK
  )
) {
  console.error(
    "'GITHUB_TOKEN', 'OPSLEVEL_TOKEN', 'GITHUB_ORGANIZATION' and 'OPSLEVEL_CUSTOM_EVENT_WEBHOOK' must be provided as environment variables."
  );
  process.exit(1);
}

const run = async () => {
  const opsLevelServices = await retrieveOpsLevelRepositories(OPSLEVEL_TOKEN);
  const withGitHubRepositories = await retrieveGitHubRepositories(
    GITHUB_TOKEN,
    GITHUB_ORGANIZATION,
    opsLevelServices
  );
  const transformed = transform(withGitHubRepositories);
  transmit(OPSLEVEL_CUSTOM_EVENT_WEBHOOK, transformed);
};

run();
