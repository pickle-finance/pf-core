import { I18n } from 'i18n';
import * as path from 'path';

function getDocs(language: string) {
    const i18nInstance = new I18n();
    const anyObject : any = {};
    i18nInstance.configure({
      locales: ['en', 'de'],
      directory: path.join(__dirname, '/locales'),
      register: anyObject,
    })
    anyObject.setLocale(language);
    const ret = anyObject.__('Hello');
    return {
      msg: ret,
    }
}

console.log(JSON.stringify(getDocs("en")));
console.log(JSON.stringify(getDocs("de")));