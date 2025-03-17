import { FunctionComponent } from "react";
import { Provider as StoreProvider, useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import { languageSelector } from "../../../selectors/language";
import UrlSync from "../url-sync/url-sync";
import LayerSelector from "../../layers/layer-selector/layer-selector";
import Navigation from "../navigation/navigation";
import { EsaLogo } from "../icons/esa-logo";
import TimeSlider from "../../layers/time-slider/time-slider";
import DataSetInfo from "../../layers/data-set-info/data-set-info";
import { store } from "./create-redux-store";

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
        <Switch>
          <Route path="/about" exact>
            {logo}
            <AboutProjectOverlay />
          </Route>
          <Route path="/stories" exact>
            <StoriesSelector />
          </Route>
          <Route path="/present" exact>
            <PresentationSelector />
          </Route>
          <Route path={["/showcase/:storyIds", "/showcase"]} exact>
            <ShowcaseSelector />
          </Route>
          <Route
            path={[
              "/:category/stories/:storyId/:slideIndex",
              "/stories/:storyId/:slideIndex",
              "/present/:storyId/:slideIndex",
              "/showcase/:storyIds/:storyIndex/:slideIndex",
            ]}
          >
            <Story />
          </Route>
          {/* By placing the DataViewer Component at the bottom, we make sure that the :category parameter
          does not interfere with other parameters */}
          <Route path={["/", "/:category", "/:category/data"]} exact>
            <Navigation />
            <DataViewer hideNavigation={true} showCategories={true} />
            {legend && <DataSetInfo />}
            {time_slider && <TimeSlider />}
            <LayerSelector />
          </Route>
        </Switch>
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
