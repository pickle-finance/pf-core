
export const XYK_JAR_DESCRIPTION = "asset.description.standard.lp";
export const UNI3_JAR_DESCRIPTION = "asset.description.univ3.lp";
export const UNI3_REWARDS_JAR_DESCRIPTION = "asset.description.univ3.rewards.lp";
export const BALANCER_REWARDS_JAR_DESCRIPTION = "asset.description.balancer.rewards.lp";
export const CURVE_REWARDS_JAR_DESCRIPTION = "asset.description.curve.rewards.lp";

export const OBTAIN_KEY_ONETOKEN_POOL = "obtain.pool.onetoken";
export const OBTAIN_KEY_ONETOKEN_JAR = "obtain.pool.onetoken.jar";
export const OBTAIN_KEY_TWOTOKEN_POOL = "obtain.pool.twotoken";
export const OBTAIN_KEY_MULTITOKEN_POOL_ANY = "obtain.pool.multitoken";
export const OBTAIN_KEY_MULTITOKEN_POOL_ALL = "obtain.pool.multitoken.all";
export const OBTAIN_KEY_UNIV3 = "obtain.pool.uni3";
export const OBTAIN_KEY_ZAPPER = "obtain.pool.zapper";

export const RISK_DIVERGENCE_LOSS = "risk.divergence.loss";
export const RISK_SMART_CONTRACT = "risk.smart.contract";
export const RISK_MAINTAIN_PEG = "risk.maintain.peg";
export const RISK_CHAIN = "risk.chain";

export const SOCIAL_KEY_DISCORD = "social.key.discord";
export const SOCIAL_KEY_TELEGRAM = "social.key.telegram";
export const SOCIAL_KEY_TWITTER = "social.key.twitter";

export enum SocialKeys {
  SOCIAL_KEY_DISCORD_NAME = "social.key.discord.withname",
  SOCIAL_KEY_TELEGRAM_NAME = "social.key.telegram.withname",
  SOCIAL_KEY_TWITTER_NAME = "social.key.twitter.withname",
  SOCIAL_KEY_WEBSITE_NAME = "social.key.website.withname",
};

export interface DocumentationModelDefinition {
  [key: string]: AssetDocumentationDefinition;
}

export interface AssetDocumentationDefinition {
  apiKey: string;
  // Defaults to apiKey + ".desc"
  descriptionKey?: TranslationKeyWithProperties;
  social?: TranslationKeyWithProperties[];
  obtain: TranslationKeyWithProperties[];
  risks: TranslationKeyWithProperties[];
}

export interface TranslationKeyWithProperties {
  key: string;
  properties?: TranslationKeyProperties;
}

export interface TranslationKeyProperties { [key: string]: string };
  
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

export enum DocsFormat {
  HTML = "html",
  MD = "markdown",
  PLAIN = "plain",
}

export type SocialKeyValueObj = {
  [key in SocialKeys]?: string;
};