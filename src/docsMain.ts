import { documentationAssetDefinitionToResult } from "./docModel/documentationImplementation";
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { DocsFormat, DocsManager } from ".";
import { AssetEnablement } from "./model/PickleModelJson";

function getDocs(language: string) {
  const docs = [];
  const allDocs = DocsManager.getAllJarDocumentationDefinitions();

  for (let i = 0; i < allDocs.length; i++) {
    docs.push(
      documentationAssetDefinitionToResult(
        language,
        DocsFormat.HTML,
        allDocs[i],
      ),
    );
  }

  const toVerify = ALL_ASSETS.filter(
    (x) =>
      x.enablement === AssetEnablement.ENABLED ||
      x.enablement === AssetEnablement.DEV,
  );

  for (let i = 0; i < toVerify.length; i++) {
    const apiKey = toVerify[i]?.details?.apiKey;
    if (apiKey !== undefined) {
      const foundDocs = allDocs.find((x) => x.apiKey === apiKey);

      if (foundDocs === undefined) {
        console.log("Docs missing for asset " + apiKey);
      }
    }
  }
  return docs;
}

console.log(JSON.stringify(getDocs("en"), null, 2));
// console.log(JSON.stringify(getDocs("de"), null, 2));
