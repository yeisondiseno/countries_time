(function () {
  try {
    var theme = localStorage.getItem("countries-time-theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
    var hourFormat = localStorage.getItem("countries-time-hour-format");
    if (hourFormat === "12h" || hourFormat === "24h") {
      document.documentElement.dataset.hourFormat = hourFormat;
    }
  } catch (error) {
    // ignore storage errors
  }
})();
