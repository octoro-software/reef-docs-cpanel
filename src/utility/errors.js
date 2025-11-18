import * as Sentry from "@sentry/react";

export const captureError = (error, hint) => {
  return Sentry.captureException(error, hint);
};

export const captureMessage = (message, context) => {
  return Sentry.captureMessage(message, { extra: context });
};
