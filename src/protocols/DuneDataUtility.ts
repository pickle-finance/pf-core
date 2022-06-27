import fetch from "cross-fetch";
import { PickleModel } from "../model/PickleModel";

const duneApi = "https://core-hsr.duneanalytics.com/v1/graphql";
const LQTY_DATA_IN_DUNE_CACHE_KEY = "LQTY.data.from.dune.cache.key";

export async function getOrLoadLqtyDataFromDune(model: PickleModel): Promise<any> {
  if (model.resourceCache.get(LQTY_DATA_IN_DUNE_CACHE_KEY))
    return model.resourceCache.get(LQTY_DATA_IN_DUNE_CACHE_KEY);

  const ret = await fetchLqtyDataFromDune();
  model.resourceCache.set(LQTY_DATA_IN_DUNE_CACHE_KEY, ret);
  return ret;
}

export async function fetchLqtyDataFromDune(): Promise<any> {
  return await getQueryResult(267603);
}

/**
 * Current result ID changes with every query run. Before we fetch the current
 * data, get the ID of the latest result.
 */
const getCurrentResultId = async (queryId: number): Promise<string> => {
  const body = {
    operationName: "GetResult",
    variables: { query_id: queryId },
    query: `query GetResult($query_id: Int!, $parameters: [Parameter!]) {
      get_result_v2(query_id: $query_id, parameters: $parameters) {
        job_id
        result_id
        error_id
      }
    }`,
  };

  const response = await fetch(duneApi, {
    body: JSON.stringify(body),
    method: "POST",
  });
  const data: any = await response.json();
  return data.data.get_result_v2.result_id;
};

export const getQueryResult = async (
  queryId: number
): Promise<any> => {
  const resultId = await getCurrentResultId(queryId);

  const body = {
    operationName: "FindResultDataByResult",
    query: `query FindResultDataByResult($result_id: uuid!) {
      query_results(where: { id: { _eq: $result_id } }) {
        id
        job_id
        error
        runtime
        generated_at
        columns
      }
      get_result_by_result_id(args: { want_result_id: $result_id }) {
        data
      }
    }`,
    variables: { result_id: resultId },
  };

  const response = await fetch(duneApi, {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      // Seems to be required.
      "x-hasura-api-key": "",
    },
  });
  const data: any = await response.json();
  return data;
};
