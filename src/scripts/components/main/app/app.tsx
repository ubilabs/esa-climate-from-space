import { FunctionComponent } from "react";
import { Provider as StoreProvider, useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import { languageSelector } from "../../../selectors/language";
import UrlSync from "../url-sync/url-sync";
import LayerLoader from "../../layers/layer-loader/layer-loader";
import Init from "../init/init";
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
import { useStoryMarkers } from "../../../hooks/use-story-markers";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import styles from "./app.module.css";
import "../../../../variables.css";

// create matomo tracking instance
const matomoInstance = createInstance({
  urlBase: "https://matomo-ext.esa.int/",
  siteId: 6,
  trackerUrl: "https://matomo-ext.esa.int/matomo.php",
  srcUrl: "https://matomo-ext.esa.int/matomo.js",
});

const TranslatedApp: FunctionComponent = () => {
  const markers = useStoryMarkers();

  const state = useSelector((state) => state);
  console.log("state", state);
  const language = useSelector(languageSelector);
  const {
    //   logo: embedLogo,
    //   globe_navigation,
    markers: embedMarkers,
    //   time_slider,
    //   legend,
  } = useSelector(embedElementsSelector);

  const logo = (
    <a target="_blank" rel="noopener noreferrer" href="https://climate.esa.int">
      <div className={styles.logo}>
        <EsaLogo />
      </div>
    </a>
  );

  return (
    <Router>
      <IntlProvider locale={language} messages={translations[language]}>
        <Switch>
          <Route path="/" exact>
            {/* {embedLogo && logo} */}
            <DataViewer
              hideNavigation={true}
              markers={embedMarkers ? markers : []}
              backgroundColor={"var(--black)"}
            />
            <Navigation />
            {/* {time_slider && <TimeSlider />}
            {legend && <DataSetInfo />} */}
            <LayerSelector />
          </Route>
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
              "/stories/:storyId/:slideIndex",
              "/present/:storyId/:slideIndex",
              "/showcase/:storyIds/:storyIndex/:slideIndex",
            ]}
            exact
          >
            <Story />
          </Route>
        </Switch>
        <Tracking />
      </IntlProvider>
      <UrlSync />
      <LayerLoader />
      <Init />
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
