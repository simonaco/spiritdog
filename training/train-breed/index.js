/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
  const breed = context.df.getInput();
  context.log(`Log from train breed for ${breed}`);

  const images = yield context.df.callActivity("get-images", breed);
  const tag = yield context.df.callActivity("create-tag", breed);
  const response = yield context.df.callActivity("upload-images", {
    tagId: tag.id,
    urls: images,
  });

  return response;
});
