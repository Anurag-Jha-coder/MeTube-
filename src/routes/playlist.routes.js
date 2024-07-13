import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";
import {
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);

router.route("/get-user-playlist/:userId").get(verifyJWT, getUserPlaylists);

router
  .route("/get-user-playlist-by-id/:playlistId")
  .get(verifyJWT, getPlaylistById);

router.route("/add-video-playlist/:playlistId/:videoId")
.get(verifyJWT,addVideoToPlaylist)

router.route("/remove-video-playlist/:playlistId/:videoId")
.get(verifyJWT,removeVideoFromPlaylist)

router.route("/delete-playlist/:playlistId").get(verifyJWT, deletePlaylist)

router.route("update-playList/:playlistId").post(verifyJWT,updatePlaylist)



export default router;
