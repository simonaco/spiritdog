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
  try {
    const response = await createImages({
      tagId: input.tagId,
      urls: input.urls,
    });
    return response;
  } catch (error) {
    context.log(
      `Error in upload image activity; Error code: ${error.code} message: ${error.message}`
    );
    throw new Error(error.message);
  }
};
