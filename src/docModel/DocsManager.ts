import { PickleAsset } from "../model/PickleModelJson";
import {
  AssetDocumentationDefinition,
  documentationAssetDefinitionToResult,
} from "./documentationImplementation";
import { ALL_JAR_DOCUMENTATION } from "./docs";


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

export class DocsManager {
  public static getDocumentationForAllAssets(
    language: string,
    linkType: DocsFormat,
  ): DocumentationModelResult {
    const result: DocumentationModelResult = {};
    for (let i = 0; i < ALL_JAR_DOCUMENTATION.length; i++) {
      const d = DocsManager.getDocumentationForAssetId(
        ALL_JAR_DOCUMENTATION[i].apiKey,
        language,
        linkType,
      );
      result[ALL_JAR_DOCUMENTATION[i].apiKey] = d;
    }
    return result;
  }

  public static getDocumentationForAsset(
    asset: PickleAsset,
    language: string,
    linkType: DocsFormat,
  ): AssetDocumentationResult {
    return DocsManager.getDocumentationForAssetId(
      asset.details.apiKey,
      language,
      linkType,
    );
  }
  public static getDocumentationForAssetId(
    assetId: string,
    language: string,
    linkType: DocsFormat,
  ): AssetDocumentationResult {
    const docItem: AssetDocumentationDefinition | undefined =
      ALL_JAR_DOCUMENTATION.find((x) => x.apiKey === assetId);
    if (!docItem) {
      return undefined;
    }
    return documentationAssetDefinitionToResult(language, linkType, docItem);
  }

  public static getAssetDocumentationString(
    docs: AssetDocumentationResult,
    format: DocsFormat,
  ): string {
    // TODO docbook format, plain text
    let ret = "";
    if (format === DocsFormat.HTML) {
      ret += "<p>" + docs.description + "</p>\n";
      if (docs.social) {
        ret += "<p>Social: ";
        for (let i = 0; i < docs.social.length; i++) {
          ret += docs.social[i] + " - ";
        }
        ret += "</p>\n";
      }
      if (docs.obtain) {
        ret += "<ul>\n";
        for (let i = 0; i < docs.obtain.length; i++) {
          ret += "  <li>" + docs.obtain[i] + "</li>\n";
        }
        ret += "</ul>\n";
      }
      if (docs.risks) {
        ret += "<ul>\n";
        for (let i = 0; i < docs.risks.length; i++) {
          ret += "  <li>" + docs.risks[i] + "</li>\n";
        }
        ret += "</ul>\n";
      }
    }
    return ret;
  }
}
