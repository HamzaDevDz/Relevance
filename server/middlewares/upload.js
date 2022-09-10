import multer from 'multer'
import {GridFsStorage} from 'multer-gridfs-storage'
import path from "path";

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI_ATLAS,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const matchImage = ["image/png", "image/jpeg", "image/jpg"]
        const matchVideo = ["video/mp4", "video/avi", "video/wmv"];

        if (matchImage.indexOf(file.mimetype) === -1 && matchVideo.indexOf(file.mimetype) === -1) {
            return 'Incorrect format'
        }

        if(matchImage.indexOf(file.mimetype) !== -1){
            return {
                bucketName: "medias",
                filename: `image-${Date.now()}${path.extname(file.originalname)}`
            }
        }

        return{
            bucketName: "medias",
            filename: `video-${Date.now()}${path.extname(file.originalname)}`
        }
    },
});

export default multer({ storage });