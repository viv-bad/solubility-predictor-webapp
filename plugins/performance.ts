export default defineNuxtPlugin(() => {
  if (process.client) {
    // Measure and log performance metrics
    window.addEventListener("load", () => {
      // Record time to first paint
      const paintMetrics = performance.getEntriesByType("paint");
      const firstPaint = paintMetrics.find(
        (metric) => metric.name === "first-paint"
      );

      console.log("First Paint:", firstPaint?.startTime);

      // Record time to interactive using newer Performance API
      setTimeout(() => {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
          const interactive = navEntry.domInteractive;

          console.log("Time to Interactive:", interactive);
        } else {
          console.log("Navigation timing not available");
        }
      }, 0);
    });
  }
});
