import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid Video ID");
  }

  const like = await Like.findOne({ video: videoId, likedBy: req.user._id });

  if (like) {
    await like.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
  }

  const likeVideo = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  if (!likeVideo) {
    throw new ApiError(401, "Failed to like video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeVideo, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(401, "Invalid Comment ID");
  }

  const like = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (like) {
    await like.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unkike successfully"));
  }

  const likeComment = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, likeComment, "Comment liked Successfully"));
});


const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(401, "Invalid Tweet ID");
  }

  const like = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (like) {
    await like.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
  }

  const likeTweet = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, likeTweet, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  }).populate("video");

  if (!likedVideos || likedVideos.length === 0) {
    throw new ApiError(404, "No liked videos found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
