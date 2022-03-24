import { ethers } from "ethers";
import { Chains, PickleModelJson } from "..";
import { readQueryFromPickleSubgraph } from "../graph/TheGraph";
import { JarDefinition } from "../model/PickleModelJson";

export async function getUserJarSummary(
  userId: string,
  model: PickleModelJson.PickleModelJson,
): Promise<IUserEarningsSummary> {
  const userData = await getUserDataFromGraph(userId);
  const jarEarnings: IJarEarnings[] = userData
    .filter((d) =>
      model.assets.jars.find(
        (element) => element.contract.toLowerCase() == d.jar.id.toLowerCase(),
      ),
    )
    .map((data) => {
      return userJarEarningsToInterface(data, model);
    });

  let jarEarningsUsd = 0;
  if (jarEarnings && jarEarnings.length > 0) {
    jarEarningsUsd = jarEarnings
      .map((jar) => jar.earnedUsd)
      .reduce((total, earnedUsd) => total + earnedUsd);
  }

  const ret = {
    userId: userId,
    earnings: jarEarningsUsd,
    jarEarnings: jarEarnings,
  };

  return ret;
}

async function getUserDataFromGraph(userId: string) {
  const query = `
      {
        user(id: "${userId}") {
          jarBalances(orderDirection: asc) {
            jar {
              id
              name
              ratio
              symbol
              token {
                id
              }
            }
            netDeposit
            grossDeposit
            grossWithdraw
            netShareDeposit
            grossShareDeposit
            grossShareWithdraw
          }
        }
      }
    `;
  const resolutions = await Promise.all(
    Chains.list().map((chain) => readQueryFromPickleSubgraph(query, chain)),
  );

  const userHas = resolutions.filter(
    (x) => x && x.data && x.data.user && x.data.user.jarBalances,
  );
  let combined = [];
  for (let i = 0; i < userHas.length; i++) {
    combined = combined.concat(userHas[i].data.user.jarBalances);
  }
  return combined;
}

function userJarEarningsToInterface(
  jarData,
  model: PickleModelJson.PickleModelJson,
): IJarEarnings {
  const jar: JarDefinition = model.assets.jars.find(
    (element) => element.contract.toLowerCase() == jarData.jar.id,
  );

  const { netShareDeposit, grossDeposit, grossWithdraw } = jarData;
  const { ratio } = jarData.jar;

  const toBalance = (value) =>
    parseFloat(
      ethers.utils.formatUnits(
        value,
        jar && jar.details && jar.details.decimals ? jar.details.decimals : 18,
      ),
    );
  const ppfs = parseFloat(ethers.utils.formatEther(ratio));
  const currentDeposit = toBalance(netShareDeposit) * ppfs;
  const totalDeposit = toBalance(grossDeposit);
  const totalWidthdraw = toBalance(grossWithdraw);
  const earned = currentDeposit - totalDeposit + totalWidthdraw;

  const depositTokenPrice =
    jar.depositToken && jar.depositToken.price ? jar.depositToken.price : 0;
  const earnedUsd = earned * depositTokenPrice;
  const balanceUsd = currentDeposit * depositTokenPrice;

  return {
    // really should be deposit token, not id,
    // keeping for backwards compat for now
    id: jarData.jar.id,
    asset: jar.details?.apiKey ?? "unknown",
    balance: currentDeposit,
    balanceUsd: balanceUsd,
    earned: earned,
    earnedUsd: earnedUsd,
  };
}
export interface IJarEarnings {
  id: string;
  asset: string;
  balance: number;
  balanceUsd: number;
  earned: number;
  earnedUsd: number;
}
export interface IUserEarningsSummary {
  userId: string;
  earnings: number;
  jarEarnings: IJarEarnings[];
}
