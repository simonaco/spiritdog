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
  const breeds = yield context.df.callActivity("get-breeds");
  const provisioningTasks = [];
  for (const breed of breeds) {
    const provisionTask = context.df.callSubOrchestrator("train-breed", breed);
    provisioningTasks.push(provisionTask);
  }

  // wait for all the training tasks to complete
  const results = yield context.df.Task.all(provisioningTasks);
  //context.df.callActivity("train-model");

  // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
  return results;
});
