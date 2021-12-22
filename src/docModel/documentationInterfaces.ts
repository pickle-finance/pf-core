import { checkProperties } from "ethers/lib/utils";
import { I18n } from "i18n";
import path from "path";
import { ALL_ASSETS } from "../model/JarsAndFarms";
import { PickleAsset } from "../model/PickleModelJson";

export interface DocumentationModelDefinition {
  [key: string]: AssetDocumentationDefinition;
}

export interface AssetDocumentationDefinition {
  apiKey: string;
  // Defaults to apiKey + ".desc"
  descriptionKey?: string;
  social?: TranslationKeyWithProperties[];
  obtain: TranslationKeyWithProperties[];
  risks: TranslationKeyWithProperties[];
}

export interface TranslationKeyWithProperties {
  key: string;
  properties?: { [key: string]: string };
}

export interface DocumentationModelResult {
  [key: string]: AssetDocumentationResult;
}

export interface AssetDocumentationResult {
  // Defaults to apiKey + ".desc"
  apiKey: string;
  description: string;
  social?: string[];
  obtain: string[];
  risks: string[];
}

export const SOCIAL_KEY_DISCORD = "social.key.discord";
export const SOCIAL_KEY_TELEGRAM = "social.key.telegram";
export const SOCIAL_KEY_TWITTER = "social.key.twitter";

export const OBTAIN_KEY_ONETOKEN_POOL = "obtain.pool.onetoken";
export const OBTAIN_KEY_TWOTOKEN_POOL = "obtain.pool.twotoken";
export const OBTAIN_KEY_MULTITOKEN_POOL = "obtain.pool.multitoken";
export const OBTAIN_KEY_ZAPPER = "obtain.pool.zapper";

export const RISK_SMART_CONTRACT = "risk.smart.contract";
export const RISK_MAINTAIN_PEG = "risk.maintain.peg";
export const RISK_PROTOCOL = "risk.protocol";

export const A_TEST_JAR_DOCUMENTATION: AssetDocumentationDefinition = {
  apiKey: "COMETH-USDC",
  social: [
    {
      key: SOCIAL_KEY_DISCORD,
      properties: { url: "(https://discord.gg/mcXn2R2QRx" },
    }, {
      key: SOCIAL_KEY_TELEGRAM,
      properties: { url: "https://t.me/cometh_io"}
    }
  ],
  obtain: [
    { key: OBTAIN_KEY_TWOTOKEN_POOL},
  ],
  risks: [
    { key: RISK_SMART_CONTRACT, properties: { protocol: "Pickle" } },
    { key: RISK_SMART_CONTRACT, properties: { protocol: "Cometh" } },
    { key: RISK_PROTOCOL, properties: { protocol: "Polygon" } },
  ],
}

export function documentationAssetDefinitionToResult(
  language: string,
  def: AssetDocumentationDefinition,
): AssetDocumentationResult {
  const asset: PickleAsset = ALL_ASSETS.find(
    (x) => x.details?.apiKey === def.apiKey,
  );
  const socialOutputArr = [];
  for (let i = 0; def.social && i < def.social.length; i++) {
    const k = def.social[i].key;
    const properties = def.social[i].properties;
    const asStr = translateSingleString(language, k, properties);
    socialOutputArr.push(asStr);
  }
  const obtainOutputArr = [];
  for (let i = 0; def.obtain && i < def.obtain.length; i++) {
    const k = def.obtain[i].key;
    let properties = def.obtain[i].properties;
    if (k === OBTAIN_KEY_TWOTOKEN_POOL && properties === undefined) {
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
    } else if (k === OBTAIN_KEY_MULTITOKEN_POOL) {
      properties = properties ? properties : {};
      def.apiKey === "IS3USD" ? console.log(properties): 0;
      properties.protocol = properties.protocol ? properties.protocol : asset.protocol ? asset.protocol : 'test';
      properties.link = properties.link ? properties.link : asset.depositToken.link;
      properties.tokens = properties.tokens ? properties.tokens : 
        asset.depositToken.components ? asset.depositToken.components.join("/") : "unknown";
    } else if (k === OBTAIN_KEY_ONETOKEN_POOL) {
      console.log(asset.depositToken.components[0]);
    }

    const asStr = translateSingleString(language, k, properties);
    obtainOutputArr.push(asStr);
  }
  const riskOutputArr = [];
  for (let i = 0; def.risks && i < def.risks.length; i++) {
    const k = def.risks[i].key;
    const properties = def.risks[i].properties;
    const asStr = translateSingleString(language, k, properties);
    riskOutputArr.push(asStr);
  }
  const descriptionKey = def.descriptionKey
    ? def.descriptionKey
    : def.apiKey + ".desc";
  const description = translateSingleString(language, descriptionKey, {});
  return {
    apiKey: def.apiKey,
    description: description,
    social: socialOutputArr,
    obtain: obtainOutputArr,
    risks: riskOutputArr,
  };
}

export function translateSingleString(
  language: string,
  key: string,
  properties: { [key: string]: string },
): string {
  const i18nInstance = new I18n();
  const anyObject: any = {};
  i18nInstance.configure({
    locales: ["en", "de"],
    directory: path.join(__dirname, "../", "/locales"),
    register: anyObject,
  });
  anyObject.setLocale(language);
  const ret = anyObject.__(key, properties);
  return ret;
}
