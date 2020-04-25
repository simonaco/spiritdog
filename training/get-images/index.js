const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const getFiles = async (context) => {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env["STORAGE_ACC"],
    process.env["STORAGE_ACC_KEY"]
  );
  const blobServiceClient = new BlobServiceClient(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    `https://${process.env.STORAGE_ACC}.blob.core.windows.net`,
    sharedKeyCredential
  );
  const allFilePaths = [];
  // Get a reference to a container
  const containerClient = await blobServiceClient.getContainerClient(
    process.env["STORAGE_ACC_CONTAINER"]
  );
  console.log("\nListing blobs...");

  // List the blob(s) in the container.
  for await (const blob of containerClient.listBlobsFlat()) {
    context.log("\t", blob.name);
    if (blob.name.toLowerCase().includes(context.bindings.input)) {
      allFilePaths.push(containerClient.url + "/" + blob.name);
    }
  }
  return allFilePaths;
};

module.exports = async function (context) {
  context.log(`Log from get-images for ${context.bindings.input}`);
  const files = getFiles(context);
  return files;
};
