import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants"
import { ResponseProps } from "@/types"
import axios from "axios"

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export const uploadFileToCloudinary = async (
    file: { uri?: string } | string,
    folderName: string
): Promise<ResponseProps> => {
    try {
        if (!file) return { success: false, data: "File is required" }

        // already upload file url
        if (typeof file == "string") return { success: false, data: file }

        if (file && file.uri) {
            const formData = new FormData()
            formData.append("file", {
                uri: file?.uri,
                type: "image/jpeg",
                name: file?.uri?.split('/').pop() || "file.jpg"
            } as any)

            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
            formData.append("folder", folderName)

            const response = await axios.post(CLOUDINARY_API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            return { success: true, data: response?.data?.secure_url }

        }

        return { success: true, data: null }

    } catch (error) {
        console.log("got error upload file to cloudinary: ", error)
        return { success: false, msg: "Upload file to cloudinary failed" + error }
    }
}


export const getAvatarPath = (file: any, isGroup = false) => {
    if (file && typeof file == "string") {
        console.log("file: ", file)
        return file
    }

    if (file && typeof file == "object") {
        return file.uri
    }

    if (isGroup) {
        return require('../assets/images/defaultGroupAvatar.png')
    }

    return require('../assets/images/defaultAvatar.png')
}