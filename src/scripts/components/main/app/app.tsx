import { FunctionComponent } from "react";
import { Provider as StoreProvider, useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import { languageSelector } from "../../../selectors/language";
import UrlSync from "../url-sync/url-sync";
import LayerSelector from "../../layers/layer-selector/layer-selector";
import Navigation from "../navigation/navigation";
import { EsaLogo } from "../icons/esa-logo";
import TimeSlider from "../../layers/time-slider/time-slider";
import DataSetInfo from "../../layers/data-set-info/data-set-info";
import { store } from "./create-redux-store";

import { ROUTES } from "../../../config/main";

import Story from "../../stories/story/story";
import StoriesSelector from "../../stories/stories-selector/stories-selector";
import PresentationSelector from "../../stories/presentation-selector/presentation-selector";
import ShowcaseSelector from "../../stories/showcase-selector/showcase-selector";
import DataViewer from "../data-viewer/data-viewer";
import Tracking from "../tracking/tracking";
import AboutProjectOverlay from "../about-project-overlay/about-project-overlay";
import translations from "../../../i18n";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import "./app.css";
import "../../../../variables.css";

// create matomo tracking instance
const matomoInstance = createInstance({
  urlBase: "https://matomo-ext.esa.int/",
  siteId: 6,
  trackerUrl: "https://matomo-ext.esa.int/matomo.php",
  srcUrl: "https://matomo-ext.esa.int/matomo.js",
});

interface MainContentProps {
  legend?: boolean;
  time_slider?: boolean;
}

const MainContent: FunctionComponent<MainContentProps> = ({
  legend,
  time_slider,
}) => (
  <>
    <Navigation />
    <DataViewer />
    {legend && <DataSetInfo />}
    {time_slider && <TimeSlider />}
    <LayerSelector />
  </>
);

const TranslatedApp: FunctionComponent = () => {
  const language = useSelector(languageSelector);
  const { time_slider, legend } = useSelector(embedElementsSelector);

  const logo = (
    <a target="_blank" rel="noopener noreferrer" href="https://climate.esa.int">
      <div className={"logo"} style={{ zIndex: 4, fill: "#fff" }}>
        <EsaLogo variant="logoWithText" />
      </div>
    </a>
  );

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
        <Routes>
          // Main application routes
          <Route
            path={ROUTES.base.path}
            element={<MainContent legend={legend} time_slider={time_slider} />}
          />
          <Route
            path={ROUTES.nav_content.path}
            element={<MainContent legend={legend} time_slider={time_slider} />}
          />
          <Route
            path={ROUTES.data.path}
            element={<MainContent legend={legend} time_slider={time_slider} />}
          />
          <Route path={ROUTES.stories.path} element={<Story />} />

          // About project
          <Route
            path={ROUTES.about.path}
            element={
              <>
                {logo}
                <AboutProjectOverlay />
              </>
            }
          />

          // Legacy routes are maintained for embedded links compatibility prior
          to version 2

          // Stories routes
          <Route

            path={ROUTES.legacy_stories.path}
            element={<StoriesSelector />}
          />
          <Route path={ROUTES.legacy_story.path} element={<Story />} />

          // Present story routes
          <Route
            path={ROUTES.present.path}
            element={<PresentationSelector />}
          />
          <Route path={ROUTES.present_story.path} element={<Story />} />
          <Route
            path={ROUTES.showcase.path}
            element={<ShowcaseSelector />}
          />
          // Showcase stories and story routes
          <Route
            path={ROUTES.showcase_stories.path}
            element={<ShowcaseSelector />}
          />
          <Route
            path={ROUTES.showcase_story.path}
            element={<Story />}
          />
        </Routes>
        <Tracking />
      </IntlProvider>
      <UrlSync />
    </Router>
  );
};

const App: FunctionComponent = () => (
  // @ts-expect-error - MatomoProvider does not include children in props since react 18

  <MatomoProvider value={matomoInstance}>
    <StoreProvider store={store}>
      <TranslatedApp />
    </StoreProvider>
  </MatomoProvider>
);

export default App;
