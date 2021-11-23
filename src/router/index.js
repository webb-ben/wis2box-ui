import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Plot from "../views/Plot.vue";
import i18n, {
  locales, 
  loadLocaleMessages, 
  SUPPORT_LOCALES, 
  setI18nLanguage
} from "../locales/i18n";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/plot",
    name: "Plot",
    component: Plot,
    params: {
      properties: {},
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// navigation guards
router.beforeEach(async (to, from, next) => {
  const paramsLocale = to.params.locale;

  // use locale if paramsLocale is not in SUPPORT_LOCALES
  if (!SUPPORT_LOCALES.includes(paramsLocale)) {
    return next(`/${locales}`);
  }

  // load locale messages
  if (!i18n.global.availableLocales.includes(paramsLocale)) {
    await loadLocaleMessages(i18n, paramsLocale);
  }

  // set i18n language
  setI18nLanguage(i18n, paramsLocale);

  return next();
});

export default router;
