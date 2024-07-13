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
import { verify } from "jsonwebtoken";

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

router.route("/get-videos").get(verifyJWT, getAllVideos);

router.route("/get-videoById/:videoId").get(verifyJWT, getVideoById);

router.route("update-video/:videoID").patch(verifyJWT, updateVideo);

router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo);

router.route("/toggle-publish-status/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
