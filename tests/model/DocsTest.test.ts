import { DocsFormat, DocsManager } from "../../src";
import { ALL_ASSETS } from "../../src/model/JarsAndFarms";
import {
  AssetEnablement,
} from "../../src/model/PickleModelJson";
import { AssetDocumentationResult } from "../../src/docModel/DocsInterfaces";
import { ExternalToken, ExternalTokenModelSingleton } from "../../src/price/ExternalTokenModel";
import { getTokenDescription } from "../../src/docModel/documentationImplementation";

describe("Testing documentation model", () => {
  test("Ensure all jars have documentation", async () => {
    const err: string[] = [];
    const assets = ALL_ASSETS.filter((x) => x.enablement !== AssetEnablement.PERMANENTLY_DISABLED);
    for( let i = 0; i < assets.length; i++ ) {
      const res: AssetDocumentationResult = DocsManager.getDocumentationForAssetId(assets[i].details.apiKey, "en", DocsFormat.HTML);
      if( res === undefined ) {
        err.push(assets[i].details.apiKey + " Has no documentation in English");
      }
    }
    console.log(JSON.stringify(err, null, 2));
    expect(err.length).toBe(0);
  });

  test("Ensure all tokens have descriptions and documentation", async () => {
    const err: string[] = [];
    const format = DocsFormat.HTML;
    const language = "en";
    const tokens: ExternalToken[] = ExternalTokenModelSingleton.getAllTokens();
    for( let i = 0; i < tokens.length; i++ ) {
      const desc = getTokenDescription(tokens[i].chain, tokens[i].id, language, format);
      if( !desc || desc.startsWith("token.")) {
        err.push("Token " + tokens[i].id + " on chain " + tokens[i].chain + " has no description");
      } else {
        //console.log("Token " + tokens[i].id + " on chain " + tokens[i].chain + " has description: " + desc);
      }
    }
    console.log(JSON.stringify(err, null, 2));
    expect(err.length).toBe(0);

  });
});
