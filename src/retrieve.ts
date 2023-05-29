import { GraphQLClient, gql } from "graphql-request";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQlQueryResponseData } from "@octokit/graphql";
import { parse } from "graphql";
import { OpsLevelServiceData } from "./types";

const OPSLEVEL_API = "https://api.opslevel.com/graphql";
const GITHUB_API = "https://api.github.com/graphql";

const createGraphQLClient = (endpoint: string, token: string) => {
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return graphQLClient;
};

export const retrieveOpsLevelRepositories = async (
  OPSLEVEL_TOKEN: string
): Promise<OpsLevelServiceData[]> => {
  const query: TypedDocumentNode<
    OpsLevelServiceData[],
    never | Record<any, never>
  > = parse(gql`
    {
      account {
        services {
          nodes {
            name
            repositories {
              totalCount
              nodes {
                name
              }
            }
          }
        }
      }
    }
  `);
  const client = createGraphQLClient(OPSLEVEL_API, OPSLEVEL_TOKEN);
  const results = client.request({ document: query });

  return results;
};

export const retrieveGitHubRepositories = async (
  GITHUB_TOKEN: string,
  owner: string,
  services: OpsLevelServiceData[]
): Promise<OpsLevelServiceData[]> => {
  const queries: TypedDocumentNode<
    GraphQlQueryResponseData[],
    never | Record<any, never>
  >[] = services.flatMap((s) =>
    s.gitHubRepositoryNames.map((r) =>
      parse(gql`
    {
      repository {
        followRenames: true
        name: ${r}
        owner: ${owner}
      }
    }
  `)
    )
  );
  const client = createGraphQLClient(GITHUB_API, GITHUB_TOKEN);
  const repositories = await Promise.all(
    queries.flatMap(async (query) => {
      const results = await client.request({ document: query });
      return results;
    })
  );

  return repositories.flat() as OpsLevelServiceData[];
};
