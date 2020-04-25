const axios = require("axios");
const _ = require("lodash");

async function createTag(context) {
  const response = await axios({
    url: `${process.env.REQUEST_URL}/tags`,
    method: "post",
    headers: {
      "Training-key": process.env.TRAINING_API_KEY,
    },
    params: {
      name: context.bindings.name,
    },
  });
  context.log(response);
  return response.data;
}
async function getTag(context) {
  const response = await axios.get(`${process.env.REQUEST_URL}/tags`, {
    headers: {
      "Training-key": process.env.TRAINING_API_KEY,
    },
  });
  let tag = _.find(response.data, { name: context.bindings.name });

  if (!tag) {
    tag = await createTag(context);
  }
  return tag;
}
module.exports = async function (context) {
  try {
    const tag = await getTag(context);
    return tag;
  } catch (error) {
    context.log(
      `Error in create tag activity; Error code: ${error.code} message: ${error.message}`
    );
    throw new Error(error.message);
  }
};
