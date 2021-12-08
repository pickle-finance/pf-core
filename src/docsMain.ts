import { A_TEST_JAR_DOCUMENTATION, documentationAssetDefinitionToResult } from './docModel/documentationInterfaces';
function getDocs(language: string) {
  return documentationAssetDefinitionToResult(language, A_TEST_JAR_DOCUMENTATION);
}

console.log(JSON.stringify(getDocs("en"), null, 2));
console.log(JSON.stringify(getDocs("de"), null, 2));