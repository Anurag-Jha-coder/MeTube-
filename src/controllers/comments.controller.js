import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.prams;

  if (!content) {
    throw new ApiError(401, "Comment is required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid Video Id");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req?.user?._id,
  });

  return res.status(200).json(200, comment, "comment added successfully");
});

const updateComment = asyncHandler(async (req, res) => {

  const { content } = req.body;
  const { videoId } = req.prams;

  if (!content) {
    throw new ApiError(401, "Comment is required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid Video Id");
  }



  

  const comment = await Comment.findByIdAndUpdate(
    videoId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  return res
  .status(200)
  .json(new ApiResponse(200, comment, "comment updated successfully"))
});

const deleteComment = asyncHandler(async (req, res) => {
  
});

export { getVideoComments, addComment, updateComment, deleteComment };
