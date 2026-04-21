import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Variáveis do Cloudinary não configuradas");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const DEFAULT_FOLDER = process.env.CLOUDINARY_FOLDER ?? "sgt-dia/alteracoes";

const mimeToFormat: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const uploadAlteracaoImage = async (
  buffer: Buffer,
  mimeType?: string,
): Promise<{ fotoUrl: string; publicId: string }> => {
  return await new Promise((resolve, reject) => {
    const options: UploadApiOptions = {
      folder: DEFAULT_FOLDER,
      resource_type: "image",
    };

    const format = mimeType ? mimeToFormat[mimeType] : undefined;
    if (format) {
      options.format = format;
    }

    const upload = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          reject(error ?? new Error("Falha no upload da imagem"));
          return;
        }

        resolve({
          fotoUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    upload.end(buffer);
  });
};
