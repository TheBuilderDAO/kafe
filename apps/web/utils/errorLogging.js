const Sentry = require('@sentry/nextjs');

const captureException = (err, context) => {
  Sentry.captureException(err, context);
};

const captureMessage = (message, context) => {
  Sentry.captureMessage(message, context);
};

module.exports = {
  captureException,
  captureMessage,
};
