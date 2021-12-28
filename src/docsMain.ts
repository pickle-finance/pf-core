import { DocsFormat, documentationAssetDefinitionToResult } from './docModel/documentationInterfaces';
import { ALL_JAR_DOCUMENTATION } from './docModel/docs';

function getDocs(language: string) {
  const docs = [];
  for (let i=0; i < ALL_JAR_DOCUMENTATION.length; i++) {
    // console.log(documentationAssetDefinitionToResult(language, ALL_JAR_DOCUMENTATION[i]));
    docs.push(documentationAssetDefinitionToResult(language, DocsFormat.HTML, ALL_JAR_DOCUMENTATION[i]));
  }
  return docs;
}

console.log(JSON.stringify(getDocs("en"), null, 2));
// console.log(JSON.stringify(getDocs("de"), null, 2));