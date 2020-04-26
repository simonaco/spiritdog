const axios = require("axios");

const createImages = async ({ tagId, urls }) => {
  const imageUrls = urls.map((url) => ({ url }));
  const response = await axios({
    url: `${process.env.REQUEST_URL}/images/urls`,
    method: "post",
    headers: {
      "Training-key": process.env.TRAINING_API_KEY,
    },
    data: {
      tagIds: [tagId],
      images: imageUrls,
    },
  });
  return response;
};

module.exports = async function (context, input) {
  context.log(
    `Log from image upload: URLS - ${JSON.stringify(input.urls)} and TagID = ${
      input.tagId
    }`
  );
  try {
    //custom vision training limited to 64 images and 20 tags per batch.
    let response;
    while (input.urls.length > 0) {
      let batch = input.urls.splice(0, 63);
      context.log(
        `Log from image upload: URLS - ${JSON.stringify(batch)} and TagID = ${
          input.tagId
        }`
      );
      response = await createImages({
        tagId: input.tagId,
        urls: batch,
      });
    }
    return response.data;
  } catch (error) {
    context.log(
      `Error in upload image activity; Error code: ${error.code} message: ${error.message}`
    );
    throw new Error(error.message);
  }
};
