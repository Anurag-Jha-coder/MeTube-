import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);

router.route("/get-user-playlist/:userId").get(verifyJWT, getUserPlaylists);

router
  .route("/get-user-playlist-by-id/:playlistId")
  .get(verifyJWT, getPlaylistById);

router.route("/add-video-playlist/:playlistId/:videoId")
.get(verifyJWT,addVideoToPlaylist)

router.route("/remove-video-playlist/:playlistId/:videoId")
.delete(verifyJWT,removeVideoFromPlaylist)

router.route("/delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist)

router.route("/update-playList/:playlistId").patch(verifyJWT,upload.none(), updatePlaylist)



export default router;
