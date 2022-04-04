import { I18n } from "i18n";
import path from "path";
import { DocsFormat } from "./DocsInterfaces";
import { SUPPORTED_LANGUAGES } from "./DocsManager";

export function translateFirstOfKeysWithFallback(
  language: string,
  keys: string[],
  properties: { [key: string]: string },
  format: DocsFormat,
  fallbackLanguage: string,
): string {
  const langs = [language, fallbackLanguage];
  for (let i = 0; i < langs.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      const result = translateSingleString(
        langs[i],
        keys[j],
        properties,
        format,
      );
      if (result !== keys[j]) {
        return result;
      }
    }
  }
  return keys && keys.length > 0 ? keys[0] : "Not Found";
}

export function translateSingleStringWithFallback(
  language: string,
  key: string,
  properties: { [key: string]: string },
  format: DocsFormat,
  fallbackLanguage: string,
): string {
  let result = translateSingleString(language, key, properties, format);
  if (result === key) {
    result = translateSingleString(fallbackLanguage, key, properties, format);
  }
  return result;
}

export function translateSingleString(
  language: string,
  key: string,
  properties: { [key: string]: string },
  format: DocsFormat,
): string {
  const i18nInstance = new I18n();
  const anyObject: any = {};
  i18nInstance.configure({
    locales: SUPPORTED_LANGUAGES,
    directory: path.join(__dirname, "../", "/locales"),
    register: anyObject,
    updateFiles: false,
  });
  anyObject.setLocale(language);
  const ret = anyObject.__(key, properties);

  return toFormat(ret, format);
}

export function toFormat(str: string, format: DocsFormat): string {
  if (str.indexOf("PFLINK") === -1) {
    return str;
  }
  const arr: string[] = str.split("PFLINK");
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].charAt(0) === "<") {
      const textEndsIndex = arr[i].indexOf(">");
      if (textEndsIndex !== -1) {
        const text = arr[i].substring(1, textEndsIndex);
        const urlEndsIndex = arr[i].indexOf(">", textEndsIndex + 1);
        if (urlEndsIndex !== -1) {
          const url = arr[i].substring(textEndsIndex + 2, urlEndsIndex);

          // do formats
          const suffix = arr[i].substring(urlEndsIndex + 1);
          if (format === DocsFormat.PLAIN) {
            arr[i] = text + "(" + url + ")" + suffix;
          } else if (format === DocsFormat.HTML) {
            arr[i] = '<a href="' + url + '">' + text + "</a>" + suffix;
          } else if (format === DocsFormat.MD) {
            arr[i] = "[" + text + "]" + "(" + url + ")" + suffix;
          }
        }
      }
    }
  }
  const myRet = arr.join("");
  return myRet;
}
