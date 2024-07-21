import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid Video Id");
  }

  const comment = await Comment.aggregate([
    {
      $match: {
        Video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "userInfo",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        userInfo: {
          $first: "$userInfo",
        },
      },
    },
    {
      $skip: parseInt((page - 1) * limit),
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  if (!comment) {
    throw new ApiError(500, "Somthing went wrong while fetching comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "All comment reterived"));
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
    .json(new ApiResponse(200, comment, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(401, "Invalid Comment ID");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment Deleted Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
