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
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const uploadService = strapi.plugin("upload").service("upload");
      const originalUpload = uploadService.upload;
      const originalDelete = uploadService.delete;

      // Override upload method to use ONLY Vercel Blob (no local storage)
      uploadService.upload = async function (files: any, options: any = {}) {
        const provider = vercelBlobProvider.init({
          token,
          folder: "tahir-electronics",
        });

        // First, let Strapi process the files normally (this handles file content, generates hashes, etc.)
        const result = await originalUpload.call(this, files, options);

        // Then upload to Vercel Blob and update URLs
        const processedFiles = Array.isArray(result) ? result : [result];

        for (const file of processedFiles) {
          try {
            const fs = require("fs");
            const path = require("path");
            const { put } = require("@vercel/blob");

            // Upload main file to Vercel Blob
            if (file.url && file.url.startsWith("/uploads/")) {
              const filePath = path.join(process.cwd(), "public", file.url);

              if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath);
                const blobPath = `tahir-electronics/${file.hash}${file.ext}`;

                const blob = await put(blobPath, fileContent, {
                  access: "public",
                  token,
                  contentType: file.mime,
                });

                // Update main file URL to point to Vercel Blob
                file.url = blob.url;
                file.provider_metadata = {
                  blobUrl: blob.url,
                  blobPath: blobPath,
                };

                // Delete local main file
                fs.unlinkSync(filePath);
                console.log(`✅ Main file uploaded to Blob: ${file.name}`);
              }
            }

            // Upload ALL formats (thumbnails, small, medium, large) to Vercel Blob
            if (file.formats) {
              for (const formatKey of Object.keys(file.formats)) {
                const format = file.formats[formatKey];
                if (format.url && format.url.startsWith("/uploads/")) {
                  const formatPath = path.join(
                    process.cwd(),
                    "public",
                    format.url
                  );

                  if (fs.existsSync(formatPath)) {
                    const formatContent = fs.readFileSync(formatPath);
                    const formatBlobPath = `tahir-electronics/${formatKey}_${file.hash}${file.ext}`;

                    const formatBlob = await put(
                      formatBlobPath,
                      formatContent,
                      {
                        access: "public",
                        token,
                        contentType: file.mime,
                      }
                    );

                    // Update format URL to point to Vercel Blob
                    file.formats[formatKey].url = formatBlob.url;
                    file.formats[formatKey].provider_metadata = {
                      blobUrl: formatBlob.url,
                      blobPath: formatBlobPath,
                    };

                    // Delete local format file
                    fs.unlinkSync(formatPath);
                    console.log(`✅ Format ${formatKey} uploaded to Blob`);
                  }
                }
              }
            }

            // Update entire file record in database with all new Blob URLs
            await strapi.query("plugin::upload.file").update({
              where: { id: file.id },
              data: {
                url: file.url,
                formats: file.formats,
                provider_metadata: file.provider_metadata,
              },
            });

            console.log(
              `🎉 ALL files (main + formats) uploaded to Vercel Blob and deleted locally: ${file.name}`
            );
          } catch (error) {
            console.error(
              `❌ Failed to upload ${file.name} to Vercel Blob:`,
              error
            );
            // Don't throw error - file is still saved locally as backup
          }
        }

        return result;
      };

      // Override delete method to delete from Blob only
      uploadService.delete = async function (file: any, options: any = {}) {
        console.log(`🗑️ Deleting file: ${file.name} (ID: ${file.id})`);

        const provider = vercelBlobProvider.init({
          token,
          folder: "tahir-electronics",
        });

        // Delete from Vercel Blob
        try {
          await provider.delete(file);
          console.log(`✅ File deleted from Vercel Blob: ${file.name}`);
        } catch (error) {
          console.error(
            `❌ Failed to delete from Vercel Blob: ${file.name}`,
            error
          );
        }

        // Call original delete to remove from database
        return originalDelete.call(this, file, options);
      };

      console.log("✅ Vercel Blob-only upload provider initialized");
    } else {
      console.warn(
        "⚠️ BLOB_READ_WRITE_TOKEN not found, using default local storage"
      );
    }
  },
};
