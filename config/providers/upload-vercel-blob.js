const { put, del } = require("@vercel/blob");

module.exports = {
  init(config) {
    const { token, folder = "uploads" } = config;

    if (!token) {
      throw new Error("Vercel Blob token is required");
    }

    return {
      async upload(file) {
        try {
          // Construct the blob path
          const blobPath = `${folder}/${file.hash}${file.ext}`;

          // Get file content
          let fileContent;

          if (file.buffer) {
            fileContent = file.buffer;
          } else if (file.stream) {
            // Convert stream to buffer
            const chunks = [];
            for await (const chunk of file.stream) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            fileContent = Buffer.concat(chunks);
          } else if (file.path) {
            const fs = require("fs");
            fileContent = await fs.promises.readFile(file.path);
          } else {
            throw new Error("No file content available");
          }

          // Upload to Vercel Blob
          const blob = await put(blobPath, fileContent, {
            access: "public",
            token,
            contentType: file.mime,
          });

          // Update file object with blob URL
          file.url = blob.url;
          file.provider_metadata = {
            blobUrl: blob.url,
            blobPath: blobPath,
          };
        } catch (error) {
          console.error("Vercel Blob upload error:", error);
          throw new Error(
            `Failed to upload file to Vercel Blob: ${error.message}`
          );
        }
      },

      async uploadStream(file) {
        return this.upload(file);
      },

      async delete(file) {
        try {
          if (file.provider_metadata?.blobUrl) {
            await del(file.provider_metadata.blobUrl, { token });
          }
        } catch (error) {
          console.error("Vercel Blob delete error:", error);
          // Don't throw error for delete operations to avoid breaking the app
          console.warn(
            `Failed to delete file from Vercel Blob: ${error.message}`
          );
        }
      },

      checkFileSize(file, { sizeLimit }) {
        if (sizeLimit && file.size > sizeLimit) {
          throw new Error(`File size exceeds limit of ${sizeLimit} bytes`);
        }
      },

      getSignedUrl(file) {
        // Vercel Blob URLs are already public and don't need signing
        return { url: file.url };
      },

      isPrivate() {
        return false; // Vercel Blob files are public by default
      },
    };
  },
};
