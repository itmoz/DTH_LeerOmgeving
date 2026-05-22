import serverless from "serverless-http";
import app from "./app.js";

const handler = serverless(app);

export const lambdaHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return await handler(event, context);
};