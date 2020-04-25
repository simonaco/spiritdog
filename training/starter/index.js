/**
 * for each breed:
 * get list of images
 * create tag 
 * create images from URL 
 * 
 * when all finished, train model
 * 
 */

const df = require("durable-functions");



module.exports = async function (context, req) {
    const client = df.getClient(context);
    const instanceId = await client.startNew(req.params.functionName, undefined, req.body);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};