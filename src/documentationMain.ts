function getDocs(language: string) {
  const msg = "hello";
  const translated = getTranslation(msg, language);
  return {
    msg: translated,
  }
}

function getTranslation(msg: string, language: string) {
  // TODO get the translation here. This is obviously stub garbage
  return language + "_" + msg; 
}

console.log(JSON.stringify(getDocs("en")));
console.log(JSON.stringify(getDocs("de")));