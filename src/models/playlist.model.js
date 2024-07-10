import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            Type:String,
            required: true
        },

        discription:{
            Type:String,
            required: true
        },

        videos :[
            {
                type:Schema.Types.ObjectId,
                ref:"Video",
                required:true
            }
        ],

        owner :{
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    }, 
    {timestamps:true})

export const Playlist = mongoose.model("Playlist", playlistSchema)