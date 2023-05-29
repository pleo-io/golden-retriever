import { GraphQLClient, gql } from "graphql-request";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { parse } from "graphql";
import { OpsLevelService } from "./types";

const OPSLEVEL_API = "https://api.opslevel.com/graphql";
const GITHUB_API = "https://api.github.com/graphql";

export interface OpsLevelServiceData {
  name: string;
  gitHubRepositoryNames: string[];
}

const createGraphQLClient = (endpoint: string, token: string) => {
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return graphQLClient;
};

interface GraphQLOpsLevelServices {
  account: {
    services: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      nodes: {
        name: string;
        repos: {
          nodes: { name: string }[];
        };
      }[];
    };
  };
}

interface GraphQLGitHubRepository {
  repository: {
    name: string;
    branchProtectionRules: {
      edges?: {
        node?: {
          requiredApprovingReviewCount: number;
        };
      };
    };
    defaultBranchRef: {
      name: string;
    };
    pullRequests: {
      totalCount: number;
    };
  };
}

const createServiceQuery = (cursor?: string) => {
  const query: TypedDocumentNode<
    GraphQLOpsLevelServices,
    never | Record<any, never>
  > = parse(gql`
{
  account {
    services${cursor ? `(after: "${cursor}")` : ""} {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        name
        repos {
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
  return query;
};

export const retrieveOpsLevelRepositories = async (
  OPSLEVEL_TOKEN: string
): Promise<OpsLevelServiceData[]> => {
  const client = createGraphQLClient(OPSLEVEL_API, OPSLEVEL_TOKEN);

  const initialQuery = createServiceQuery();
  const results = await client.request({ document: initialQuery });
  let hasNextPage = results.account.services.pageInfo.hasNextPage;
  while (hasNextPage) {
    const pageQuery = createServiceQuery(
      results.account.services.pageInfo.endCursor
    );
    const pageResults = await client.request({ document: pageQuery });
    const nodes = results.account.services.nodes.concat(
      pageResults.account.services.nodes
    );
    results.account.services.nodes = nodes;
    hasNextPage = pageResults.account.services.pageInfo.hasNextPage;
  }

  const mapped = results.account.services.nodes.map((n) => {
    return {
      name: n.name,
      gitHubRepositoryNames: n.repos.nodes.map((n) => n.name),
    };
  });

  return mapped;
};

export const retrieveGitHubRepositories = async (
  GITHUB_TOKEN: string,
  owner: string,
  services: OpsLevelServiceData[]
): Promise<OpsLevelService[]> => {
  const queries = services.flatMap((s) => {
    return {
      name: s.name,
      queries: s.gitHubRepositoryNames.map((r) => {
        const repoQuery: TypedDocumentNode<
          GraphQLGitHubRepository,
          never | Record<any, never>
        > = parse(gql`
    {
        repository(followRenames: true, name: "${r}", owner: "${owner}") {
            name
            branchProtectionRules(first: 100) {
                edges {
                    node {
                        requiredApprovingReviewCount
                    }
                }
            }
            defaultBranchRef {
                name
            }
            pullRequests(first: 100, states: OPEN, labels: "dependencies") {
                totalCount
            }
        } 
    }
  `);
        return repoQuery;
      }),
    };
  });
  const client = createGraphQLClient(GITHUB_API, GITHUB_TOKEN);
  const data: OpsLevelService[] = await Promise.all(
    queries.map(async (queries) => {
      const fetched = await Promise.all(
        queries.queries.map(async (q) => await client.request({ document: q }))
      );
      const result: OpsLevelService = {
        name: queries.name,
        gitHubRepositories: fetched.map((r) => {
          return {
            name: r.repository.name,
            defaultBranchName: r.repository.defaultBranchRef.name,
            openRenovatePrs: r.repository.pullRequests.totalCount,
            prApprovalsNeeded:
              r.repository.branchProtectionRules.edges?.node
                ?.requiredApprovingReviewCount,
          };
        }),
      };
      return result;
    })
  );

  return data;
};
