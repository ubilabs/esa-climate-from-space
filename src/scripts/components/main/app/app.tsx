import { FunctionComponent, StrictMode } from "react";
import { Provider as StoreProvider, useSelector } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import { store } from "./create-redux-store";
import { languageSelector } from "../../../selectors/language";
import translations from "../../../i18n";

import UrlSync from "../url-sync/url-sync";
import Navigation from "../navigation/navigation";
import LayerSelector from "../../layers/layer-selector/layer-selector";
import DataViewer from "../data-viewer/data-viewer";
import Tracking from "../tracking/tracking";

import StoriesSelector from "../../stories/stories-selector/stories-selector";
import PresentationSelector from "../../stories/presentation-selector/presentation-selector";
import ShowcaseSelector from "../../stories/showcase-selector/showcase-selector";
import Story from "../../stories/story/story";
import AboutProjectOverlay from "../about-project-overlay/about-project-overlay";

import "./app.css";
import "../../../../variables.css";
import { EsaLogoLink } from "../logo/logo";

// Create Matomo tracking instance
const matomoInstance = createInstance({
  urlBase: "https://matomo-ext.esa.int/",
  siteId: 6,
  trackerUrl: "https://matomo-ext.esa.int/matomo.php",
  srcUrl: "https://matomo-ext.esa.int/matomo.js",
});

const MainContent: FunctionComponent = () => (
  <>
    <Navigation />
    <DataViewer />
    <LayerSelector />
  </>
);

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
          <Route path="/" element={<MainContent />} />
          <Route path="/:category" element={<MainContent />} />
          <Route path="/:category/data" element={<MainContent />} />

          <Route
            path="/about"
            element={
              <>
                <EsaLogoLink />
                <AboutProjectOverlay />
              </>
            }
          />
          <Route path="/stories" element={<StoriesSelector />} />
          <Route path="/stories/:storyId/:slideIndex" element={<Story />} />
          <Route path="/present" element={<PresentationSelector />} />
          <Route path="/present/:storyId/:slideIndex" element={<Story />} />
          <Route path="/showcase" element={<ShowcaseSelector />} />
          <Route path="/showcase/:storyIds" element={<ShowcaseSelector />} />
          <Route
            path="/showcase/:storyIds/:storyIndex/:slideIndex"
            element={<Story />}
          />
          <Route
            path="/:category/stories/:storyId/:slideIndex"
            element={<Story />}
          />
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
