(function () {
  const VEGA_SCRIPT_URLS = [
    "https://storage.googleapis.com/esa-cfs-cdn/vega/v5/vega.min.js",
    "https://storage.googleapis.com/esa-cfs-cdn/vega-lite/v5/vega-lite.min.js",
    "https://storage.googleapis.com/esa-cfs-cdn/vega-embed/v6/vega-embed.min.js",
  ];

  function injectStyles() {
    const style = document.createElement("style");

    style.textContent = `
      html,
      body,
      #vis {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
      }

      @font-face {
        font-style: normal;
        font-family: NotesESA;
        src: url("https://storage.googleapis.com/esa-cfs-cdn/fonts/NotesEsaReg.otf");
      }

      body {
        background: transparent;
        font-family: NotesESA, Arial, Helvetica, sans-serif;
      }

      .error {
        box-sizing: border-box;
        max-width: 42rem;
        padding: 1rem;
        color: rgba(255, 255, 255, 0.85);
        font: 13px/1.5 NotesESA, Arial, Helvetica, sans-serif;
      }
    `;

    document.head.appendChild(style);
  }

  function injectMarkup() {
    document.body.innerHTML = '<div id="vis"></div>';
  }

  function showError(message) {
    const container = document.getElementById("vis");
    container.innerHTML = "";
    container.className = "error";
    container.textContent = message;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load script: ${src}`));

      document.head.appendChild(script);
    });
  }

  async function loadVegaScripts() {
    for (const scriptUrl of VEGA_SCRIPT_URLS) {
      await loadScript(scriptUrl);
    }
  }

  async function loadFonts() {
    if (!document.fonts) {
      return;
    }

    try {
      await document.fonts.load("16px NotesESA");
      await document.fonts.load("18px NotesESA");
    } catch (error) {
      console.error("Error loading fonts:", error);
    }
  }

  async function renderChart() {
    injectStyles();
    injectMarkup();

    try {
      await Promise.all([loadFonts(), loadVegaScripts()]);

      const container = document.getElementById("vis");
      const spec = window.spec;

      if (!spec) {
        throw new Error(
          "Missing Vega specification. Define window.spec before loading esa-vega-chart.js.",
        );
      }

      spec.width = container.clientWidth;
      spec.height = container.clientHeight;

      const { view } = await vegaEmbed("#vis", spec, { actions: false });

      let resizeRAF;
      window.addEventListener("resize", () => {
        cancelAnimationFrame(resizeRAF);
        resizeRAF = requestAnimationFrame(() => {
          view
            .width(container.clientWidth)
            .height(container.clientHeight)
            .run();
        });
      });
    } catch (error) {
      console.error(error);
      showError(error.message);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderChart);
  } else {
    renderChart();
  }
})();
