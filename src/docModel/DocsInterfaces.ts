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

export enum SocialKeys {
  SOCIAL_KEY_DISCORD_NAME = "social.key.discord.withname",
  SOCIAL_KEY_TELEGRAM_NAME = "social.key.telegram.withname",
  SOCIAL_KEY_TWITTER_NAME = "social.key.twitter.withname",
  SOCIAL_KEY_WEBSITE_NAME = "social.key.website.withname",
};

export type SocialKeyValueObj = {
  [key in SocialKeys]?: string;
};