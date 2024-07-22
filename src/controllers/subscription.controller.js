import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const channel = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if(channel){
     await channel.deleteOne();
     return res
     .status(200)
     .json(new ApiResponse(200, {}, "successfully unsubscribed"));
  }

  const newSubscription = await Subscription.create({
    channel: channelId,
    subscriber: req.user._id,
  })

  if (!newSubscription) {
    throw new ApiError(500, "Subscription failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newSubscription, "successfully subscribed")); 
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  
  if(!isValidObjectId(channelId)){
    throw new ApiError(400, "Invalid channel id");
  }

  const subscriptions = await Subscription.find({channel: channelId}).populate('subscriber', 'fullname email username avatar coverImage').lean();

  const subscribers = subscriptions.map(subscription => subscription.subscriber);

  if(!subscribers || subscribers.length === 0){
    throw new ApiError(404, "No subscriber found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "subscriber list"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id");
    }

    const subscriptions = await  Subscription.find({subscriber: subscriberId}).populate('channel','fullname email username avatar coverImage').lean();
    
    const channels = subscriptions.map(subscription => subscription.channel);
    

    if(!channels || channels.length === 0){
        throw new ApiError(404, "No channel found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channels, "channel list"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
