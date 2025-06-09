const axios = require("axios");

let loggerURL = process.env.ERRSYNC_LOGGER_URL || "";

/**
 * Configure a custom logger endpoint.
 * @param {Object} options
 * @param {string} options.endpoint - Remote logging endpoint.
 */
function configureLogger({ endpoint }) {
  if (!endpoint || typeof endpoint !== "string" || endpoint.trim() === "") {
    throw new Error("Logger endpoint must be a non-empty string URL.");
  }
  loggerURL = endpoint;
}

/**
 * Sends the error payload to the remote logger.
 * @param {Object} errorPayload
 */
async function reportError(errorPayload) {
  if (!loggerURL || typeof loggerURL !== "string" || loggerURL.trim() === "") {
    throw new Error("Logger URL is not set.");
  }

  try {
    await axios.post(loggerURL, errorPayload);
  } catch (err) {
    console.error("Error reporting to logger:", err.message);
  }
}

/**
 * Log an error remotely with details.
 */
async function logError({
  service = "unknown-service",
  type = "UNKNOWN_ERROR",
  error,
  tags = [],
  payload = {},
}) {
  if (!error || typeof error !== "object") {
    throw new Error("A valid 'error' object must be provided.");
  }

  const errorPayload = {
    service,
    type,
    errorMessage: error.message,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    payload,
    tags,
    timestamp: new Date().toISOString(),
  };

  await reportError(errorPayload);
}

module.exports = {
  configureLogger,
  logError,
};
