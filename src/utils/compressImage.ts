import imageCompression from "browser-image-compression";

export const convertToWebP = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not create canvas context"));
        return;
      }

      ctx.drawImage(image, 0, 0);

      // Convert to WebP with 0.8 quality
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Could not create WebP blob"));
        },
        "image/webp",
        0.6
      );
    };

    image.onerror = () => reject(new Error("Could not load image"));
    image.src = URL.createObjectURL(file);
  });
};

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    // Try to convert to WebP if browser supports it
    if ("toBlob" in document.createElement("canvas")) {
      try {
        const webpBlob = await convertToWebP(compressedFile);
        return new File([webpBlob], file.name.replace(/\.[^/.]+$/, ".webp"), {
          type: "image/webp",
        });
      } catch (err) {
        console.warn(
          "WebP conversion failed, using compressed original format",
          err
        );
        return compressedFile;
      }
    }

    return compressedFile;
  } catch (err) {
    console.warn("Image compression failed", err);
    return file; // Return original if compression fails
  }
};
// Function to convert file to base64
export const fileToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
