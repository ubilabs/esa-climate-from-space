export function setGlobeContainerPosition(x: number, y: number) {
  const root = document.documentElement;

  root.style.setProperty("--globe-container-y", `${y * -100}vh`);
  root.style.setProperty("--globe-container-x", `${x * -100}vw`);
}

export function setGlobeContainerOpacity(opacity: number) {
  document.documentElement.style.setProperty(
    "--globe-container-opacity",
    String(opacity),
  );
}
