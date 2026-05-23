import { getClient } from "@/lib/http-client";

export async function uploadImageAction(fileOrImg, fieldName = "image") {
  try {
    const client = getClient();
    const file = fileOrImg?.file || fileOrImg;
    const formData = new FormData();
    formData.append(fieldName, file);
    const res = await client.post("/upload", formData);
    return { success: true, data: { url: res.data?.data?.url } };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to upload image",
    };
  }
}
