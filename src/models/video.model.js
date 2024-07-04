
import mongoose, {Schema} from "mongoose";



const videoSchema = new Schema(
    {
        videoFile:{
            type: String,
            required:true,
        },
        thumbnail:{
            type: String,
            required:true,
        },
        title:{
            type: String,
            required:true,
        },
        discription:{
            type: String,
            required:true,
        },
        duration:{
            type:Number,
            required:ture
        },
        views:{
            type: Number,
            default: 0,
        },
        isPublished:{
            type: Boolean,
            default:true,
        },

        owner:{
            type: Schema.Types.ObjectId,
            ref:"User",
        }


    },
    {
        timestamp:true
    }
)



export const Video = mongoose.model("Video", videoSchema)