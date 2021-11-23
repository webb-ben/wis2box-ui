// i18n
// Lazy Loading: https://vue-i18n.intlify.dev/guide/advanced/lazy.html
import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import axios from "axios";

// Modified from https://phrase.com/blog/posts/ultimate-guide-to-vue-localization-with-vue-i18n/
const locales = require.context(".", true, /[\w-_,\s]+\.json$/i);
const SUPPORT_LOCALES = [];
locales.keys().forEach((key) => {
  const matched = key.match(/([\w-_]+)\./i);
  if (matched && matched.length > 1 && matched[1] != "_template") {
    SUPPORT_LOCALES.push(matched[1]);
  }
});
export { locales, SUPPORT_LOCALES };

const i18n_options = {
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: "en",
  fallbackLocale: "en",
  globalInjection: true,
};

export default function setupI18n() {
  const i18n = createI18n(i18n_options);
  setI18nLanguage(i18n, i18n_options.locale);
  return i18n;
}

export function setI18nLanguage(i18n, locale) {
  i18n.global.locale = locale;
  axios.defaults.headers.common["Accept-Language"] = locale;
  document.querySelector("html").setAttribute("lang", locale);
}

export async function loadLocaleMessages(i18n, locale) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./${locale}.json`
  );

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}
