import { documentationAssetDefinitionToResult, generateAutomaticDefinition } from "./documentationImplementation";
import { ALL_JAR_DOCUMENTATION } from "./docs";
import {
  AssetDocumentationDefinition,
  AssetDocumentationResult,
  DocsFormat,
  DocumentationModelResult,
} from "./DocsInterfaces";
import { ALL_ASSETS, JAR_UNI_RLY_ETH } from "../model/JarsAndFarms";

export class DocsManager {
  public static getAllJarDocumentationDefinitions(): AssetDocumentationDefinition[] {
    // TODO build this out
    const manualDocs: AssetDocumentationDefinition[] = [...ALL_JAR_DOCUMENTATION];
    const manualApiKeys: string[] = manualDocs.map((x) => x.apiKey);
    const missingApiKeys = ALL_ASSETS.filter((x) => x && x.details && x.details.apiKey && !manualApiKeys.includes(x.details.apiKey));
    const automaticDocDefinitions: AssetDocumentationDefinition[] = [];
    for( let i = 0; i < missingApiKeys.length; i++ ) {
      const tmp = generateAutomaticDefinition([missingApiKeys[i].details.apiKey]);
      if( tmp && tmp.length > 0 && tmp[0] !== undefined) {
        automaticDocDefinitions.push(tmp[0]);
      }
    }
    return manualDocs.concat(automaticDocDefinitions);
  }

  public static getDocumentationForAllAssets(
    language: string,
    linkType: DocsFormat,
  ): DocumentationModelResult {
    const result: DocumentationModelResult = {};
    const allDocDefinitions = this.getAllJarDocumentationDefinitions();
    for (let i = 0; i < allDocDefinitions.length; i++) {
      const d = DocsManager.getDocumentationForAsset(
        allDocDefinitions[i],
        language,
        linkType,
      );
      result[allDocDefinitions[i].apiKey] = d;
    }
    return result;
  }

  public static getDocumentationForAsset(
    docsDefinition: AssetDocumentationDefinition,
    language: string,
    linkType: DocsFormat,
  ): AssetDocumentationResult {
    return documentationAssetDefinitionToResult(
      language,
      linkType,
      docsDefinition,
    );
  }

  public static getDocumentationForAssetId(
    apiKey: string,
    language: string,
    linkType: DocsFormat,
  ): AssetDocumentationResult {
    const definition: AssetDocumentationDefinition | undefined =
      this.getAllJarDocumentationDefinitions().find(
        (x) => x.apiKey.toLowerCase() === apiKey.toLowerCase(),
      );
    if (!definition) {
      return undefined;
    }
    return documentationAssetDefinitionToResult(language, linkType, definition);
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
