import { ALL_ASSETS } from "../model/JarsAndFarms";
import {
  AssetProtocol,
  JarDefinition,
  PickleAsset,
  XYK_SWAP_PROTOCOLS,
} from "../model/PickleModelJson";
import { DocsFormat } from "..";
import {
  AssetDocumentationDefinition,
  AssetDocumentationResult,
  BALANCER_REWARDS_JAR_DESCRIPTION,
  CURVE_REWARDS_JAR_DESCRIPTION,
  OBTAIN_KEY_MULTITOKEN_POOL_ALL,
  OBTAIN_KEY_MULTITOKEN_POOL_ANY,
  OBTAIN_KEY_ONETOKEN_POOL,
  OBTAIN_KEY_TWOTOKEN_POOL,
  OBTAIN_KEY_UNIV3,
  RISK_CHAIN,
  RISK_DIVERGENCE_LOSS,
  RISK_SMART_CONTRACT,
  SocialKeyValueObj,
  TranslationKeyProperties,
  TranslationKeyWithProperties,
  UNI3_JAR_DESCRIPTION,
  UNI3_REWARDS_JAR_DESCRIPTION,
  XYK_JAR_DESCRIPTION,
} from "./DocsInterfaces";
import {
  translateFirstOfKeysWithFallback,
  translateSingleStringWithFallback,
} from "./DocsTranslations";
import { PROTOCOL_SOCIAL_MODEL, TOKEN_SOCIAL_MODEL } from "./DocsDetailModel";

export function documentationAssetDefinitionToResult(
  language: string,
  format: DocsFormat,
  def: AssetDocumentationDefinition,
): AssetDocumentationResult {
  const asset: PickleAsset = ALL_ASSETS.find(
    (x) => x.details?.apiKey === def.apiKey,
  );
  const socialOutputArr = [];
  for (let i = 0; def.social && i < def.social.length; i++) {
    const k = def.social[i].key;
    const properties = def.social[i].properties;
    const asStr = translateSingleStringWithFallback(
      language,
      k,
      properties,
      format,
      "en",
    );
    socialOutputArr.push(asStr);
  }
  const obtainOutputArr = [];
  for (let i = 0; def.obtain && i < def.obtain.length; i++) {
    const obtainKey = def.obtain[i].key;
    const properties = getObtainTranslationProperties(
      asset,
      obtainKey,
      def.obtain[i].properties,
    );
    const asStr = translateSingleStringWithFallback(
      language,
      obtainKey,
      properties,
      format,
      "en",
    );
    obtainOutputArr.push(asStr);
  }
  const riskOutputArr = [];
  for (let i = 0; def.risks && i < def.risks.length; i++) {
    const k = def.risks[i].key;
    const properties = def.risks[i].properties;
    const asStr = translateSingleStringWithFallback(
      language,
      k,
      properties,
      format,
      "en",
    );
    riskOutputArr.push(asStr);
  }
  const descriptionKey = def.descriptionKey
    ? def.descriptionKey
    : { key: def.apiKey + ".desc", properties: {} };
  const description = translateSingleStringWithFallback(
    language,
    descriptionKey.key,
    descriptionKey.properties || {},
    format,
    "en",
  );

  const componentTokens: { [key: string]: string } = {};
  const relatedTokens: { [key: string]: string } = {};
  const components: string[] = asset.depositToken.components || [];
  const related: string[] = (asset as JarDefinition).rewardTokens || [];
  const chain: string = asset.chain;
  for (let i = 0; i < components.length; i++) {
    const val = getTokenDescription(chain, components[i], language, format);
    componentTokens[components[i]] = val;
  }
  for (let i = 0; i < related.length; i++) {
    if (!components.includes(related[i])) {
      relatedTokens[related[i]] = getTokenDescription(chain, related[i], language, format);
    }
  }

  return {
    apiKey: def.apiKey,
    description: description,
    social: socialOutputArr,
    obtain: obtainOutputArr,
    risks: riskOutputArr,
    componentTokens: componentTokens,
    relevantTokens: relatedTokens,
  };
}

export function getTokenDescription(chain: string, token: string, language: string, format: DocsFormat): string {
  const descKey =
  "token." + chain + "." + token.toLowerCase() + ".desc";
  const backupKey = "token.all." + token.toLowerCase() + ".desc";
  const val = translateFirstOfKeysWithFallback(
    language,
    [descKey, backupKey],
    {},
    format,
    "en",
  );
  return val;
}

export function getObtainTranslationProperties(
  asset: PickleAsset,
  obtainKey: string,
  properties: TranslationKeyProperties,
): TranslationKeyProperties {
  if (obtainKey === OBTAIN_KEY_TWOTOKEN_POOL && properties === undefined) {
    if (
      asset.depositToken.components &&
      asset.depositToken.components.length === 2
    ) {
      properties = {
        token1: asset.depositToken.components[0],
        token2: asset.depositToken.components[1],
        protocol: asset.protocol,
        link: asset.depositToken.link,
      };
    }
  } else if (
    obtainKey === OBTAIN_KEY_MULTITOKEN_POOL_ANY ||
    obtainKey === OBTAIN_KEY_MULTITOKEN_POOL_ALL
  ) {
    properties = properties ? properties : {};
    properties.protocol = properties.protocol
      ? properties.protocol
      : asset.protocol;
    properties.link = properties.link
      ? properties.link
      : asset.depositToken.link;
    properties.tokens = properties.tokens
      ? properties.tokens
      : asset.depositToken.components
      ? asset.depositToken.components.join("/")
      : "unknown";
  } else if (obtainKey === OBTAIN_KEY_ONETOKEN_POOL) {
    // TODO ? not sure
  }
  return properties;
}

export function generateAutomaticDefinition(
  keys: string[],
): AssetDocumentationDefinition[] {
  const ret: AssetDocumentationDefinition[] = [];
  for (let i = 0; i < keys.length; i++) {
    const asset: PickleAsset = ALL_ASSETS.find(
      (x) => x.details?.apiKey === keys[i],
    );
    if (asset) {
      if (
        XYK_SWAP_PROTOCOLS.map((x) => x.protocol)
          .map((x) => x.toString())
          .includes(asset.protocol)
      ) {
        ret.push(generateXykDocumentation(asset));
      } else if (asset.protocol === AssetProtocol.UNISWAP_V3) {
        ret.push(generateUni3Documentation(asset));
      } else if (
        asset.protocol === AssetProtocol.BEETHOVENX ||
        asset.protocol === AssetProtocol.BALANCER
      ) {
        ret.push(generateBalancerStyleDocumentation(asset));
      } else if (asset.protocol === AssetProtocol.CURVE) {
        ret.push(generateCurveStyleDocumentation(asset));
      }
    }
  }
  return ret;
}

export function generateXykDocumentation(
  asset: PickleAsset,
): AssetDocumentationDefinition {
  const desc = generateAutomaticXYKDescription(asset);
  const socials: TranslationKeyWithProperties[] =
    generateAutomaticSocials(asset);
  const risks: TranslationKeyWithProperties[] = getAutomaticRisks(asset);

  let obtain: TranslationKeyWithProperties[] = [];
  obtain.push({ key: OBTAIN_KEY_TWOTOKEN_POOL });
  obtain = obtain.concat(getZapObtains(asset));

  const oneDefinition: AssetDocumentationDefinition = {
    apiKey: asset.details.apiKey,
    descriptionKey: desc,
    social: socials,
    obtain: obtain,
    risks: risks,
  };
  return oneDefinition;
}

export function generateUni3Documentation(
  asset: PickleAsset,
): AssetDocumentationDefinition {
  const desc = generateAutomaticUni3Description(asset);
  let obtain: TranslationKeyWithProperties[] = [];
  const components = (asset as JarDefinition).depositToken.components;
  if (components && components.length === 2 && components[0] && components[1]) {
    const props: any = {
      token1: components[0],
      token2: components[1],
    };
    obtain.push({ key: OBTAIN_KEY_UNIV3, properties: props });
  }
  obtain = obtain.concat(getZapObtains(asset));
  return generateAllStyleDocumentation(asset, desc, obtain);
}

export function generateBalancerStyleDocumentation(
  asset: PickleAsset,
): AssetDocumentationDefinition {
  const desc: TranslationKeyWithProperties = {
    key: BALANCER_REWARDS_JAR_DESCRIPTION,
    properties: generateAutomaticDescriptionProperties(asset),
  };
  let obtain: TranslationKeyWithProperties[] = [];
  obtain.push({ key: OBTAIN_KEY_TWOTOKEN_POOL });
  obtain = obtain.concat(getZapObtains(asset));
  return generateAllStyleDocumentation(asset, desc, obtain);
}

export function generateCurveStyleDocumentation(
  asset: PickleAsset,
): AssetDocumentationDefinition {
  const desc: TranslationKeyWithProperties = {
    key: CURVE_REWARDS_JAR_DESCRIPTION,
    properties: generateAutomaticDescriptionProperties(asset),
  };
  let obtain: TranslationKeyWithProperties[] = [];
  obtain.push({ key: OBTAIN_KEY_MULTITOKEN_POOL_ANY });
  obtain = obtain.concat(getZapObtains(asset));
  return generateAllStyleDocumentation(asset, desc, obtain);
}

export function generateAllStyleDocumentation(
  asset: PickleAsset,
  desc: TranslationKeyWithProperties,
  obtain: TranslationKeyWithProperties[],
): AssetDocumentationDefinition {
  const socials: TranslationKeyWithProperties[] =
    generateAutomaticSocials(asset);
  const risks: TranslationKeyWithProperties[] = getAutomaticRisks(asset);

  const oneDefinition: AssetDocumentationDefinition = {
    apiKey: asset.details.apiKey,
    descriptionKey: desc,
    social: socials,
    obtain: obtain,
    risks: risks,
  };
  return oneDefinition;
}
export function getZapObtains(
  _asset: PickleAsset,
): TranslationKeyWithProperties[] {
  // TODO zapper? When to add it?
  // {
  //   key: OBTAIN_KEY_ZAPPER,
  //   properties: {
  //     poolName: "ETH/DAI",
  //     poolUrl:
  //       "https://zapper.fi/invest?appId=sushiswap&contractAddress=0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f&modal=pool-deposit",
  //   },
  // }
  // TODO - add pickleZap ?
  return [];
}

export function getAutomaticRisks(
  asset: PickleAsset,
): TranslationKeyWithProperties[] {
  const risks: TranslationKeyWithProperties[] = [];
  risks.push({ key: RISK_CHAIN, properties: { chain: asset.chain } });
  risks.push({
    key: RISK_SMART_CONTRACT,
    properties: { protocol: asset.protocol },
  });
  const stake = (asset as JarDefinition).stakingProtocol;
  if (stake && stake !== asset.protocol)
    risks.push({ key: RISK_SMART_CONTRACT, properties: { protocol: stake } });
  risks.push({ key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } });
  risks.push({ key: RISK_DIVERGENCE_LOSS, properties: {} });
  return risks;
}

export function generateAutomaticDescriptionProperties(asset: PickleAsset): {
  [key: string]: string;
} {
  const pair: string[] = asset.depositToken.components || [];
  const toUpper = pair.map((x) => x.toUpperCase()).join("/");
  const sl = (asset as JarDefinition).stakingProtocol
    ? (asset as JarDefinition).stakingProtocol
    : asset.protocol;
  const rt = (asset as JarDefinition).rewardTokens;
  const rewardString = rt ? rt.map((x) => x.toUpperCase()).join(",") : "";
  const properties = {
    protocol: asset.protocol,
    tokens: toUpper,
    poolUrl: asset.depositToken.link,
    stakeLocation: sl,
    rewards: rewardString,
  };
  return properties;
}

export function generateAutomaticXYKDescription(
  asset: PickleAsset,
): TranslationKeyWithProperties | undefined {
  return {
    key: XYK_JAR_DESCRIPTION,
    properties: generateAutomaticDescriptionProperties(asset),
  };
}

export function generateAutomaticUni3Description(
  asset: PickleAsset,
): TranslationKeyWithProperties | undefined {
  const sl = (asset as JarDefinition).stakingProtocol
    ? (asset as JarDefinition).stakingProtocol
    : asset.protocol;
  const rt = (asset as JarDefinition).rewardTokens
    ? (asset as JarDefinition).rewardTokens
    : undefined;
  const usesStaking = sl !== undefined && rt !== undefined;
  const key = usesStaking ? UNI3_REWARDS_JAR_DESCRIPTION : UNI3_JAR_DESCRIPTION;
  return {
    key: key,
    properties: generateAutomaticDescriptionProperties(asset),
  };
}

export function generateAutomaticSocials(
  asset: PickleAsset,
): TranslationKeyWithProperties[] {
  const socials: TranslationKeyWithProperties[] = [];
  if (PROTOCOL_SOCIAL_MODEL[asset.protocol]) {
    const socialModelForDeposit: SocialKeyValueObj =
      PROTOCOL_SOCIAL_MODEL[asset.protocol];
    for (const k in socialModelForDeposit) {
      const translationKey = k;
      const url = socialModelForDeposit[k];
      const name = asset.protocol;
      socials.push({
        key: translationKey,
        properties: { name: name, url: url },
      });
    }
  }

  const stakingProtocol = (asset as JarDefinition).stakingProtocol;
  if (stakingProtocol && PROTOCOL_SOCIAL_MODEL[stakingProtocol]) {
    const socialModelForDeposit: SocialKeyValueObj =
      PROTOCOL_SOCIAL_MODEL[stakingProtocol];
    for (const k in socialModelForDeposit) {
      const translationKey = k;
      const url = socialModelForDeposit[k];
      socials.push({
        key: translationKey,
        properties: { name: stakingProtocol, url: url },
      });
    }
  }

  const tokens: string[] = asset.depositToken.components || [];
  for (let z = 0; z < tokens.length; z++) {
    const oneToken = asset.depositToken.components[z];
    if (oneToken && TOKEN_SOCIAL_MODEL[oneToken]) {
      const socialModelForDeposit: SocialKeyValueObj =
        TOKEN_SOCIAL_MODEL[oneToken];
      for (const k in socialModelForDeposit) {
        const translationKey = k;
        const url = socialModelForDeposit[k];
        socials.push({
          key: translationKey,
          properties: { name: oneToken, url: url },
        });
      }
    }
  }
  return socials;
}
