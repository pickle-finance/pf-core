import { documentationAssetDefinitionToResult } from "./docModel/documentationImplementation";
import { ALL_JAR_DOCUMENTATION } from "./docModel/docs";
import { ALL_ASSETS } from "./model/JarsAndFarms";
import { DocsFormat } from ".";

function getDocs(language: string) {
  const docs = [];
  for (let i = 0; i < ALL_JAR_DOCUMENTATION.length; i++) {
    // console.log(documentationAssetDefinitionToResult(language, ALL_JAR_DOCUMENTATION[i]));
    docs.push(
      documentationAssetDefinitionToResult(
        language,
        DocsFormat.HTML,
        ALL_JAR_DOCUMENTATION[i],
      ),
    );
  }

  for (let i = 0; i < ALL_ASSETS.length; i++) {
    const apiKey = ALL_ASSETS[i]?.details?.apiKey;
    if (apiKey !== undefined) {
      const foundDocs = ALL_JAR_DOCUMENTATION.find((x) => x.apiKey === apiKey);
      if (foundDocs === undefined) {
        console.log("Docs missing for asset " + apiKey);
      }
    }
  }
  return docs;
}

console.log(JSON.stringify(getDocs("en"), null, 2));
// console.log(JSON.stringify(getDocs("de"), null, 2));
