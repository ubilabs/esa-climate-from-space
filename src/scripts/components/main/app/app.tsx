import {
  FunctionComponent,
  StrictMode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Provider as StoreProvider,
  useDispatch,
  useSelector,
} from "react-redux";
import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";

import { IntlProvider } from "react-intl";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import { store } from "./create-redux-store";
import { languageSelector } from "../../../selectors/language";
import translations from "../../../i18n";

import UrlSync from "../url-sync/url-sync";
import { EsaLogoLink } from "../logo/logo";
import Header from "../header/header";
import LayerSelector from "../../layers/layer-selector/layer-selector";
import DataViewer from "../data-viewer/data-viewer";
import Tracking from "../tracking/tracking";

import { ROUTES } from "../../../config/main";

import { setAppRoute } from "../../../reducers/app-route";

import StoriesSelector from "../../legacy-stories/stories-selector/stories-selector";
import PresentationSelector from "../../legacy-stories/presentation-selector/presentation-selector";
import ShowcaseSelector from "../../legacy-stories/showcase-selector/showcase-selector";
import LegacyStory from "../../legacy-stories/story/story";
import Story from "../../stories/story/story";
import AboutProjectOverlay from "../about-project-overlay/about-project-overlay";

import "./app.css";
import "../../../../variables.css";
import { CustomParallaxProvider } from "../../stories/stories-parallex-provider/stories-parallex";

// Create Matomo tracking instance
const matomoInstance = createInstance({
  urlBase: "https://matomo-ext.esa.int/",
  siteId: 6,
  trackerUrl: "https://matomo-ext.esa.int/matomo.php",
  srcUrl: "https://matomo-ext.esa.int/matomo.js",
});

const MainContent: FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <CustomParallaxProvider>
        <Header />
        {children}
        <DataViewer />
        <LayerSelector />
      </CustomParallaxProvider>
    </>
  );
};

// This component is used to update the app route in the store
// This is useful because we use the current path to determine app state
const RouteMatch: FunctionComponent = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAppRoute(location.pathname));
  }, [location.pathname, dispatch]);

  return <Outlet />;
};

const TranslatedApp: FunctionComponent = () => {
  const language = useSelector(languageSelector);

  return (
    <IntlProvider
      key={language} // ensures re-render on language change
      locale={language}
      messages={translations[language]}
    >
      <Router>
        <Routes>
          <Route element={<RouteMatch />}>
            {/*  About project */}
            <Route
              path={ROUTES.about.path}
              element={
                <>
                  <EsaLogoLink />
                  <AboutProjectOverlay />
                </>
              }
            />
            {/*  Legacy routes are maintained for embedded links compatibility prior
          to version 2 */}
            <Route
              path={ROUTES.legacy_stories.path}
              element={<StoriesSelector />}
            />
            <Route path={ROUTES.legacy_story.path} element={<LegacyStory />} />
            {/* Present story routes */}
            <Route
              path={ROUTES.present.path}
              element={<PresentationSelector />}
            />
            <Route path={ROUTES.present_story.path} element={<LegacyStory />} />
            <Route path={ROUTES.showcase.path} element={<ShowcaseSelector />} />
            {/* Showcase stories and story routes */}
            <Route
              path={ROUTES.showcase_stories.path}
              element={<ShowcaseSelector />}
            />
            <Route
              path={ROUTES.showcase_story.path}
              element={<LegacyStory />}
            />
            {/*  Main application routes */}
            <Route path={ROUTES.base.path} element={<MainContent />} />
            <Route path={ROUTES.nav_content.path} element={<MainContent />} />
            <Route path={ROUTES.data.path} element={<MainContent />} />
            <Route
              path={ROUTES.stories.path}
              element={
                <>
                  <MainContent children={<Story />} />
                </>
              }
            />
          </Route>
        </Routes>
        <Tracking />
        <UrlSync />
      </Router>
    </IntlProvider>
  );
};

const App: FunctionComponent = () => (
  <StrictMode>
    {/* @ts-expect-error - children prop not typed correctly in MatomoProvider */}
    <MatomoProvider value={matomoInstance}>
      <StoreProvider store={store}>
        <TranslatedApp />
      </StoreProvider>
    </MatomoProvider>
  </StrictMode>
);

export default App;
