import { ALL_ASSETS } from "../model/JarsAndFarms";
import { JarDefinition, PickleAsset, XYK_SWAP_PROTOCOLS } from "../model/PickleModelJson";
import { DocsFormat } from "..";
import {
  AssetDocumentationDefinition,
  AssetDocumentationResult,
  SocialKeyValueObj,
  TranslationKeyProperties,
  TranslationKeyWithProperties,
} from "./DocsInterfaces";
import { translateSingleString } from "./DocsTranslations";
import { PROTOCOL_SOCIAL_MODEL, TOKEN_SOCIAL_MODEL } from "./DocsDetailModel";

export const XYK_JAR_DESCRIPTION = "asset.description.standard.lp";
export const SOCIAL_KEY_DISCORD = "social.key.discord";
export const SOCIAL_KEY_TELEGRAM = "social.key.telegram";
export const SOCIAL_KEY_TWITTER = "social.key.twitter";

export const OBTAIN_KEY_ONETOKEN_POOL = "obtain.pool.onetoken";
export const OBTAIN_KEY_TWOTOKEN_POOL = "obtain.pool.twotoken";
export const OBTAIN_KEY_MULTITOKEN_POOL = "obtain.pool.multitoken";
export const OBTAIN_KEY_ZAPPER = "obtain.pool.zapper";

export const RISK_DIVERGENCE_LOSS = "risk.divergence.loss";
export const RISK_SMART_CONTRACT = "risk.smart.contract";
export const RISK_MAINTAIN_PEG = "risk.maintain.peg";
export const RISK_CHAIN = "risk.chain";

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
    const asStr = translateSingleString(language, k, properties, format);
    socialOutputArr.push(asStr);
  }
  const obtainOutputArr = [];
  for (let i = 0; def.obtain && i < def.obtain.length; i++) {
    const obtainKey = def.obtain[i].key;
    const properties = getObtainTranslationProperties(asset, obtainKey, def.obtain[i].properties);
    const asStr = translateSingleString(language, obtainKey, properties, format);
    obtainOutputArr.push(asStr);
  }
  const riskOutputArr = [];
  for (let i = 0; def.risks && i < def.risks.length; i++) {
    const k = def.risks[i].key;
    const properties = def.risks[i].properties;
    const asStr = translateSingleString(language, k, properties, format);
    riskOutputArr.push(asStr);
  }
  const descriptionKey = def.descriptionKey
    ? def.descriptionKey
    : {key: def.apiKey + ".desc", properties: {}};
  const description = translateSingleString(
    language,
    descriptionKey.key,
    descriptionKey.properties || {},
    format,
  );
  return {
    apiKey: def.apiKey,
    description: description,
    social: socialOutputArr,
    obtain: obtainOutputArr,
    risks: riskOutputArr,
  };
}

export function getObtainTranslationProperties(asset: PickleAsset, obtainKey: string, properties: TranslationKeyProperties): TranslationKeyProperties {
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
  } else if (obtainKey === OBTAIN_KEY_MULTITOKEN_POOL) {
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

export function generateAutomaticDefinition(keys: string[]): AssetDocumentationDefinition[] {
  const ret: AssetDocumentationDefinition[] = [];
  for( let i = 0; i < keys.length; i++ ) {
    const asset: PickleAsset = ALL_ASSETS.find((x) => x.details?.apiKey === keys[i]);
    if( asset ) {
      if( XYK_SWAP_PROTOCOLS.map((x) => x.protocol).map((x) => x.toString()).includes(asset.protocol)) {
        const oneDefinition: AssetDocumentationDefinition = generateXykDocumentation(asset);
        ret.push(oneDefinition);
      }
    }
  }
  return ret;
}

export function generateXykDocumentation(asset: PickleAsset): AssetDocumentationDefinition {
  let desc = generateAutomaticDescription(asset);
  if( !desc ) {
    desc = {key: asset.details.apiKey + ".desc", properties: {}};
  }
  const socials: TranslationKeyWithProperties[] = generateAutomaticSocials(asset);

  const obtain = [];
  obtain.push({ key: OBTAIN_KEY_TWOTOKEN_POOL });
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
  
  const risks: TranslationKeyWithProperties[] = [];
  risks.push({ key: RISK_CHAIN, properties: { chain: asset.chain }});
  risks.push({ key: RISK_SMART_CONTRACT, properties: { protocol: asset.protocol }});
  const stake = (asset as JarDefinition).stakingProtocol;
  if(  stake && stake !== asset.protocol )
    risks.push({ key: RISK_SMART_CONTRACT, properties: { protocol: stake }});
  risks.push({ key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" }});
  risks.push({ key: RISK_DIVERGENCE_LOSS, properties: {}});
  
  
  const oneDefinition: AssetDocumentationDefinition = {
    apiKey: asset.details.apiKey,
    descriptionKey: desc,
    social: socials,
    obtain: obtain,
    risks: risks,
  }
  return oneDefinition;
}
export function generateAutomaticDescription(asset: PickleAsset): TranslationKeyWithProperties | undefined {
  const protocol = asset.protocol;
  if( XYK_SWAP_PROTOCOLS.map((x) => x.protocol).map((x) => x.toString()).includes(protocol)) {
    const key = XYK_JAR_DESCRIPTION;
    const pair: string[] = (asset.depositToken.components || []);
    const toUpper = pair.map((x) => x.toUpperCase()).join("/");
    const sl = (asset as JarDefinition).stakingProtocol ? (asset as JarDefinition).stakingProtocol : asset.protocol;
    const rt = asset.details.rewardTokens;
    const rewardString = rt ? rt.map((x) => x.toUpperCase()).join(",") : "";
    const properties = {
      protocol: protocol,
      pair: toUpper,
      poolUrl: asset.depositToken.link,
      stakeLocation: sl,
      rewards: rewardString,
    }
    return {key: key, properties: properties};
  }
  return undefined;
}

export function generateAutomaticSocials(asset: PickleAsset): TranslationKeyWithProperties[] {
  const socials: TranslationKeyWithProperties[] = [];
  if( PROTOCOL_SOCIAL_MODEL[asset.protocol]) {
    const socialModelForDeposit: SocialKeyValueObj = PROTOCOL_SOCIAL_MODEL[asset.protocol];
    for (const k in socialModelForDeposit) {
      const translationKey = k;
      const url = socialModelForDeposit[k];
      const name = asset.protocol;
      socials.push({key: translationKey, properties: {name: name, url: url}});
    }
  }

  const stakingProtocol = (asset as JarDefinition).stakingProtocol;
  if( stakingProtocol && PROTOCOL_SOCIAL_MODEL[stakingProtocol]) {
    const socialModelForDeposit: SocialKeyValueObj = PROTOCOL_SOCIAL_MODEL[stakingProtocol];
    for (const k in socialModelForDeposit) {
      const translationKey = k;
      const url = socialModelForDeposit[k];
      socials.push({key: translationKey, properties: {name: stakingProtocol, url: url}});
    }
  }

  const tokens: string[] = asset.depositToken.components || [];
  for( let z = 0; z < tokens.length; z++ ) {
    const oneToken = asset.depositToken.components[z];
    if( oneToken && TOKEN_SOCIAL_MODEL[oneToken]) {
      const socialModelForDeposit: SocialKeyValueObj = TOKEN_SOCIAL_MODEL[oneToken];
      for (const k in socialModelForDeposit) {
        const translationKey = k;
        const url = socialModelForDeposit[k];
        socials.push({key: translationKey, properties: {name: oneToken, url: url}});
      }
    }
  }
  return socials;
}