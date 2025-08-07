import type { Core } from "@strapi/strapi";
import { put, del } from "@vercel/blob";

const vercelBlobProvider = {
  init(config: any) {
    const { token, folder = "uploads" } = config;

    if (!token) {
      throw new Error("Vercel Blob token is required");
    }

    return {
      async upload(file: any) {
        try {
          // Construct the blob path
          const blobPath = `${folder}/${file.hash}${file.ext}`;

          // Get file content
          let fileContent: Buffer;

          if (file.buffer) {
            fileContent = file.buffer;
          } else if (file.stream) {
            // Convert stream to buffer
            const chunks: Buffer[] = [];
            for await (const chunk of file.stream) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            fileContent = Buffer.concat(chunks);
          } else if (file.path) {
            const fs = await import("fs");
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
        } catch (error: any) {
          console.error("Vercel Blob upload error:", error);
          throw new Error(
            `Failed to upload file to Vercel Blob: ${error.message}`
          );
        }
      },

      async uploadStream(file: any) {
        return this.upload(file);
      },

      async delete(file: any) {
        try {
          if (file.provider_metadata?.blobUrl) {
            await del(file.provider_metadata.blobUrl, { token });
          }
        } catch (error: any) {
          console.error("Vercel Blob delete error:", error);
          // Don't throw error for delete operations to avoid breaking the app
          console.warn(
            `Failed to delete file from Vercel Blob: ${error.message}`
          );
        }
      },

      checkFileSize(file: any, { sizeLimit }: { sizeLimit: number }) {
        if (sizeLimit && file.size > sizeLimit) {
          throw new Error(`File size exceeds limit of ${sizeLimit} bytes`);
        }
      },

      getSignedUrl(file: any) {
        // Vercel Blob URLs are already public and don't need signing
        return { url: file.url };
      },

      isPrivate() {
        return false; // Vercel Blob files are public by default
      },
    };
  },
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {
    // No provider registration needed - we'll override in bootstrap
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Override upload service to use Vercel Blob
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const uploadService = strapi.plugin("upload").service("upload");
      const originalUpload = uploadService.upload;
      const originalDelete = uploadService.delete;

      // Override upload method
      uploadService.upload = async function (files: any, options: any = {}) {
        const provider = vercelBlobProvider.init({
          token,
          folder: "tahir-electronics",
        });

        // First process files through original upload to get proper file structure
        const result = await originalUpload.call(this, files, options);

        // Then upload to Vercel Blob
        const processedFiles = Array.isArray(result) ? result : [result];
        for (const file of processedFiles) {
          try {
            // Read file from local path and upload to Vercel Blob
            if (file.url && file.url.startsWith("/uploads/")) {
              const fs = require("fs");
              const path = require("path");
              const filePath = path.join(process.cwd(), "public", file.url);

              if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath);
                const blobPath = `tahir-electronics/${file.hash}${file.ext}`;

                const { put } = require("@vercel/blob");
                const blob = await put(blobPath, fileContent, {
                  access: "public",
                  token,
                  contentType: file.mime,
                });

                // Update the file URL to point to Vercel Blob
                file.url = blob.url;
                file.provider_metadata = {
                  blobUrl: blob.url,
                  blobPath: blobPath,
                };

                // Update in database
                await strapi.query("plugin::upload.file").update({
                  where: { id: file.id },
                  data: {
                    url: blob.url,
                    provider_metadata: file.provider_metadata,
                  },
                });

                console.log(`✅ File uploaded to Vercel Blob: ${blob.url}`);
              }
            }
          } catch (error) {
            console.error("Vercel Blob upload error:", error);
            // Don't fail the upload if Vercel Blob fails - file is still saved locally
          }
        }

        return result;
      };

      // Override delete method
      uploadService.delete = async function (file: any, options: any = {}) {
        const provider = vercelBlobProvider.init({
          token,
          folder: "tahir-electronics",
        });

        await provider.delete(file);
        return originalDelete.call(this, file, options);
      };

      console.log("✅ Vercel Blob upload provider initialized");
    } else {
      console.warn("⚠️ BLOB_READ_WRITE_TOKEN not found, using local storage");
    }
  },
};
