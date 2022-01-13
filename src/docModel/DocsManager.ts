import { PickleAsset } from "../model/PickleModelJson";
import { AssetDocumentationDefinition, AssetDocumentationResult, DocsFormat, documentationAssetDefinitionToResult } from "./documentationImplementation";
import { ALL_JAR_DOCUMENTATION } from "./docs";
export class DocsManager {
    public static getDocumentationForAsset(asset: PickleAsset, 
        language: string, linkType: DocsFormat): AssetDocumentationResult {
        const key = asset.details.apiKey;
        const docItem: AssetDocumentationDefinition | undefined  = ALL_JAR_DOCUMENTATION.find((x)=>x.apiKey===key);
        if( !docItem ) {
            return undefined;
        }
        return documentationAssetDefinitionToResult(language, linkType, docItem);
    }
    public static getAssetDocumentationString(docs: AssetDocumentationResult, format: DocsFormat): string {
        // TODO docbook format, plain text
        let ret = "";
        if( format === DocsFormat.HTML) {
            ret += "<p>" + docs.description + "</p>\n";
            if( docs.social ) {
                ret += "<p>Social: ";
                for( let i = 0; i < docs.social.length; i++ ) {
                    ret += docs.social[i] + " - ";
                }
                ret += "</p>\n";
            }
            if( docs.obtain ) {
                ret += "<ul>\n"
                for( let i = 0; i < docs.obtain.length; i++ ) {
                    ret += "  <li>" + docs.obtain[i] + "</li>\n";
                }
                ret += "</ul>\n";
            }
            if( docs.risks ) {
                ret += "<ul>\n"
                for( let i = 0; i < docs.risks.length; i++ ) {
                    ret += "  <li>" + docs.risks[i] + "</li>\n";
                }
                ret += "</ul>\n";
            }
        }
        return ret;
    }
}