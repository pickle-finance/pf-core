import fetch from "cross-fetch";
import { PickleModel } from "../model/PickleModel";

const DUNE_API = "https://core-hsr.duneanalytics.com/v1/graphql";
const body = {
  operationName: "FindResultDataByResult",
  query:
    "query FindResultDataByResult($result_id: uuid!) {\n  query_results(where: {id: {_eq: $result_id}}) {\n    id\n    job_id\n    error\n    runtime\n    generated_at\n    columns\n    __typename\n  }\n  get_result_by_result_id(args: {want_result_id: $result_id}) {\n    data\n    __typename\n  }\n}\n",
  variables: { result_id: "90b9cec0-c576-4f87-b5e3-770ceaa99e45" },
};

const YEARN_DATA_IN_DUNE_CACHE_KEY = "yearn.data.from.dune.cache.key";

export async function getOrLoadYearnDataFromDune(model: PickleModel) {
  if (model.resourceCache.get(YEARN_DATA_IN_DUNE_CACHE_KEY))
    return model.resourceCache.get(YEARN_DATA_IN_DUNE_CACHE_KEY);

  const ret = fetchYearnDataFromDune();
  model.resourceCache.set(YEARN_DATA_IN_DUNE_CACHE_KEY, ret);
  return ret;
}

export async function fetchYearnDataFromDune(): Promise<any> {
  const data: any = await fetch(DUNE_API, {
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
  }).then((x) => x.json());
  return data;
}
