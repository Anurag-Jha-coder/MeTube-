import mongoose, {  isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  //TODO: get all videos based on query, sort, pagination
   
   if(!isValidObjectId(userId)){
    throw new ApiError(400, "Invalid User Id");
  }
 
    const Aggregate = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
  
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $addFields: {
          owner: { $arrayElemAt: ["$owner", 0] },
        },
      },
      {
        $sort: {
          [sortBy]: sortType === "asc" ? 1 : -1, //sort is not working properly...ToDo : fix
        },
      },
      {
        $skip:parseInt((page-1)*limit)
      },
      {
        $limit:parseInt(limit)
      },
      {
        $project: {
          title: 1,
          thumbnail: 1,
          description: 1,
          duration: 1,
          isPublished: 1,
          "owner.avatar": 1,
          "owner.username": 1,
        },
      },
    ]);
  
  
  return res
  .status(200)
  .json(new ApiResponse(200, Aggregate, "Videos fetched successfully"));
  
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video and thumbnail, upload to cloudinary, create video
  if (!title || !description) {
    throw new ApiError(400, "title and thumbnail are required");
    l;
  }

  const localVideoPath = req.files?.videoFile[0]?.path;
  const localThumbnailPath = req.files?.thumbnail[0]?.path;

  if (!localVideoPath) {
    throw new ApiError(400, "video not found");
  }

  if (!localThumbnailPath) {
    throw new ApiError(400, "thumbnail not found");
  }

  const videoFile = await uploadOnCloudinary(localVideoPath);
  const thumbnail = await uploadOnCloudinary(localThumbnailPath);

  if (!videoFile) {
    throw new ApiError(500, "Error while uploading video on cloudinary");
  }

  if (!thumbnail) {
    throw new ApiError(500, "Error while uploading thumbnail on cloudinary");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: videoFile.duration,
    isPublished: true,
    owner: req?.user?._id,
  });

  if (!video) {
    throw new ApiError(501, "Something went wrong while publishing video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video retrived successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const { title, description } = req.body;

  if (title.trim() == "" || description.trim() == "") {
    throw new ApiError(400, "title and discription can't be empty ");
  }
  console.log(req.file)
  const localThumbnailPath = req.file?.path;

  if (!localThumbnailPath) {
    throw new ApiError(404, "Thumbnail not found");
  }

  const thumbnail = await uploadOnCloudinary(localThumbnailPath);

  if (!thumbnail) {
    throw new ApiError(
      500,
      "Somthing went wrong while uploading thumbnail on cloudinary"
    );
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: thumbnail?.url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  //  ***here i have to delete that video from cloudnary too........
  // deleteFromCloudinary(public_id)  ** for this i also have to store public
  // id in our databse with the url
  if(!isValidObjectId(videoId)){
    throw new ApiError(401, "Invalid video Id")
  }

  await Video.deleteOne(new mongoose.Types.ObjectId(videoId)); 

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video successfully deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  video.isPublished = !video.isPublished;
  await video.save({ isValidObjectId: false });
` 1`
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video.isPublished,
        "Publish Status changed successfully "
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
