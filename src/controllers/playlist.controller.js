import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if(!name || !description){
        throw new ApiError(400, "Name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req?.user?._id
    })

    if(!playlist){
        throw new ApiError(500, "Unable to create playlist")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const playlists = await Playlist.find({owner:userId})

    if(!playlists){
        throw new ApiError(404, "No playlists found")
    } 

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists found"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist found"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(401, "playlist id or video id is not valid")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $push: {videos: videoId}    
    }, {new:true})

    if(!playlist){
        throw new ApiError(500, "Unable to add video to playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(401, "playlist id or video id is not valid")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: {videos: videoId}    
    }, {new:true})

    if(!playlist){
        throw new ApiError(500, "Unable to remove video from playlist")
    }

    return res
    . status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist successfully")) 

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(401, "playlist id is not valid")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(401, "playlist id is not valid")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set:{
            name,
            description,
        }
    })

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}