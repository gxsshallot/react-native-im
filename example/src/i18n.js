import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

function merge(...jsons) {
    return jsons.reduce((prv, cur) => ({...prv, ...cur}), {});
}

const translationGetters = {
    zh: () => merge(
        require('react-native-im/language/zh.json'),
        require('../language/zh.json'),
    ),
};

export default function setI18nConfig() {
    const fallback = { languageTag: 'zh', isRTL: false };
    const { languageTag, isRTL } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
    I18nManager.forceRTL(isRTL);
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
}

RNLocalize.addEventListener("change", () => {
    setI18nConfig();
});