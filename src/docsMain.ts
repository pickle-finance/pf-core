import { documentationAssetDefinitionToResult } from "./docModel/documentationImplementation";
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { DocsFormat, DocsManager } from ".";

function getDocs(language: string) {
  const docs = [];
  const allDocs = DocsManager.getAllJarDocumentationDefinitions();
  for (let i = 0; i < allDocs.length; i++) {
    // console.log(documentationAssetDefinitionToResult(language, ALL_JAR_DOCUMENTATION[i]));
    docs.push(
      documentationAssetDefinitionToResult(
        language,
        DocsFormat.HTML,
        allDocs[i],
      ),
    );
  }

  for (let i = 0; i < ALL_ASSETS.length; i++) {
    const apiKey = ALL_ASSETS[i]?.details?.apiKey;
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
