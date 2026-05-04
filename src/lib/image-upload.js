const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function uploadImages(files) {
  if (!files || files.length === 0) {
    return [];
  }

  const uploadedImages = [];

  for (const img of files) {
    if (!img.file || typeof img.file !== "object") {
      continue;
    }

    const formData = new FormData();
    formData.append("image", img.file);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    if (data.data?.url) {
      uploadedImages.push({ url: data.data.url });
    }
  }

  return uploadedImages;
}

export function parseListInput(value) {
  if (!value) return [];
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseSpecs(specsObj) {
  if (!specsObj || typeof specsObj !== "object") {
    return {};
  }

  const specs = {};
  Object.keys(specsObj).forEach((key) => {
    const val = specsObj[key];
    if (val && typeof val === "string" && val.trim()) {
      specs[key] = val.trim();
    }
  });

  return specs;
}
