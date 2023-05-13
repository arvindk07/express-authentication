import { Schema, model } from "mongoose";
import Paginator from "mongoose-paginate-v2";

const postSchema = new Schema(
  {
    postImage: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          ref: "users",
          type: Schema.Types.ObjectId,
        },
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(Paginator);

const Post = model("posts", postSchema);

export default Post;
