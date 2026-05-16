import serverless from "serverless-http";
import app from "./app.js";

export const lambdaHandler = serverless(app);