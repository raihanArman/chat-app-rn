import { Platform } from "react-native";

export const API_URL = Platform.OS == "android" ? "http://127.0.0.1:3000" : "http://localhost:3000"

export const CLOUDINARY_CLOUD_NAME = "dzfyojpfy"
export const CLOUDINARY_UPLOAD_PRESET = "images"