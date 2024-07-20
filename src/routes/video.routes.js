import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";


const router = Router();

router.route("/publish-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/get-videos").get(verifyJWT, getAllVideos);  // Todo : not working havet to fix it later

router.route("/get-videoById/:videoId").get( verifyJWT, getVideoById);

router.route("/update-video/:videoID").patch(verifyJWT,
  upload.single("thumbnail"), updateVideo);

router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo);

router.route("/toggle-publish-status/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
