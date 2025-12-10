import { FunctionComponent, StrictMode, useEffect } from "react";

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
import { store } from "./create-redux-store";

import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import { StoryProvider } from "../../../providers/story/story-provider";

import { languageSelector } from "../../../selectors/language";

import { setSelectedContentAction } from "../../../reducers/content";

import translations from "../../../i18n";

import UrlSync from "../url-sync/url-sync";
import { EsaLogoLink } from "../logo/logo";
import Header from "../header/header";
import LayerSelector from "../../layers/layer-selector/layer-selector";
import DataViewer from "../data-viewer/data-viewer";
import CookieConsent from "../cookie-consent/cookie-consent";
import StoriesSelector from "../../legacy-stories/stories-selector/stories-selector";
import PresentationSelector from "../../legacy-stories/presentation-selector/presentation-selector";
import ShowcaseSelector from "../../legacy-stories/showcase-selector/showcase-selector";
import LegacyStory from "../../legacy-stories/story/story";
import Story from "../../stories/story/story";
import AboutProjectOverlay from "../about-project-overlay/about-project-overlay";

import { useGetStoryQuery } from "../../../services/api";
import { useContentParams } from "../../../hooks/use-content-params";

import { ROUTES } from "../../../config/main";

import { setAppRoute } from "../../../reducers/app-route";

import { isLegacyStory } from "../../../libs/is-legacy-story";

import "./app.css";
import "../../../../variables.css";
import SearchPage from "../search/search-page";
import ContentSearch from "../search/content-search";

// Create Matomo tracking instance
const matomoInstance = createInstance({
  urlBase: "https://matomo-ext.esa.int/",
  siteId: 6,
  trackerUrl: "https://matomo-ext.esa.int/matomo.php",
  srcUrl: "https://matomo-ext.esa.int/matomo.js",
});

const StoryWrapper: FunctionComponent<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const lang = useSelector(languageSelector);
  const { currentStoryId } = useContentParams();
  const dispatch = useDispatch();

  const { data: story } = useGetStoryQuery({
    id: currentStoryId,
    language: lang,
  });

  useEffect(() => {
    if (!story?.id || !currentStoryId) {
      return;
    }

    dispatch(setSelectedContentAction({ contentId: story.id }));

    // Cleanup is intentionally omitted on unmount
    // This ensures the story Content ID persists, allowing the correct entry
    // to remain selected in the content navigation.
  }, [currentStoryId, dispatch, story?.id]);

  // Redux Toolkit may cache the story data, so it's essential to confirm
  // the presence of the currentStoryId
  if (currentStoryId && story && isLegacyStory(story)) {
    return <LegacyStory />;
  }

  return <StoryProvider story={story || null}>{children}</StoryProvider>;
};

const LegacyOrRecentStory: FunctionComponent = () => {
  return (
    <StoryWrapper>
      <Header />
      <Story />
    </StoryWrapper>
  );
};

const MainContent: FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <StoryWrapper>
        <Header />
        {children}
        <DataViewer />
        <LayerSelector />
      </StoryWrapper>
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
            <Route
              path={ROUTES.search.path}
              element={
                <>
                  <Header />
                  <ContentSearch />
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
            <Route
              path={ROUTES.present_story.path}
              element={<LegacyOrRecentStory />}
            />
            <Route path={ROUTES.showcase.path} element={<ShowcaseSelector />} />
            {/* Showcase stories and story routes */}
            <Route
              path={ROUTES.showcase_stories.path}
              element={<ShowcaseSelector />}
            />
            <Route
              path={ROUTES.showcase_story.path}
              element={<LegacyOrRecentStory />}
            />
            {/*  Main application routes */}
            <Route path={ROUTES.base.path} element={<MainContent />} />
            <Route path={ROUTES.nav_content.path} element={<MainContent />} />
            <Route path={ROUTES.data.path} element={<MainContent />} />
            <Route
              path={ROUTES.stories.path}
              element={<MainContent children={<Story />} />}
            />
          </Route>
        </Routes>
        <CookieConsent />
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
