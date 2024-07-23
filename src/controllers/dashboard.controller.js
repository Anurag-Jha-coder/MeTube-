import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id;
  const channelStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likevideos",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$likevideos" } },
        totalSubscribers: { $first: "$subscribers" },
      },
    },
    {
      $project: {
        _id: 0,
        totalVideos: 1,
        totalViews: 1,
        totalLikes: 1,
        totalSubscribers: { $size: "$totalSubscribers" },
      },
    },
  ]);

  if (!channelStats) {
    throw new ApiError(504, "Error while fetching channel stats");
  }

  console.log(channelStats);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelStats[0],
        "Channel stats fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  
  const videos = await Video.find({owner:userId}).sort({createdAt:-1});

  if(!videos || videos.length === 0){
    throw new ApiError(404, "No videos found for this channel");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
