const { configureLogger, logError } = require("../src");

configureLogger({
  endpoint: "https://jsonplaceholder.typicode.com/posts",
});

(async () => {
  try {
    throw new Error("Sample test error from errsync logger");
  } catch (err) {
    await logError({
      service: "test-service",
      type: "TEST_ERROR",
      error: err,
      tags: ["test", "sample"],
      payload: { userId: 123 },
    });
    console.log("Error logged successfully.");
  }
})();
