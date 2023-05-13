import { Router } from "express";
import { Post, User } from "../models";
import { DOMAIN } from "../config";
import { userAuth } from "../middlewares/auth-gaurd";
import { uploadPostImage as uploader } from "../middlewares/uploader";
import validator from "../middlewares/validator-middleware";
import { postValidations } from "../validators/post-validators";
import SlugGenerator from "../functions/slug-generator";

const router = Router();

router.post(
  "/post-image-upload",
  userAuth,
  uploader.single("image"),
  async (req, res) => {
    try {
      let { file } = req;
      let filename = DOMAIN + "/post-images/" + file.filename;
      console.log("FILE", file);
      return res.status(200).json({
        success: true,
        // filename,
        message: "Image Uploaded Successfully",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Unable to create the post.",
      });
    }
  }
);

router.post(
  "/create-post",
  userAuth,
  postValidations,
  validator,
  async (req, res) => {
    try {
      let { body } = req;
      let post = new Post({
        author: req.user._id,
        ...body,
        slug: SlugGenerator(body.title),
      });
      // console.log("NEW POST", post);
      await post.save();
      return res.status(201).json({
        post,
        success: true,
        message: "Your Post is published",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Unable to create the post.",
      });
    }
  }
);

router.put(
  "update-post/:id",
  userAuth,
  postValidations,
  validator,
  async (req, res) => {
    try {
      let { id } = req.params;
      let { user, body } = req;

      let post = await Post.findById(_id);
      if (post.author.toString() !== user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "Post doesn't belong to you.",
        });
      }
      post = await Post.findOneAndUpdate(
        {
          author: user._id,
          _id: id,
        },
        {
          ...body,
          slug: SlugGenerator(body.title),
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        post,
        success: true,
        message: "Post is Updated Successfully",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Unable to Update the post.",
      });
    }
  }
);

router.delete(
  "delete-post/:id",
  userAuth,
  postValidations,
  validator,
  async (req, res) => {
    try {
      let { id } = req.params;
      let { user, body } = req;

      let post = await Post.findById(id);
      if (post.author.toString() !== user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "Post doesn't belong to you.",
        });
      }
      post = await Post.findOneAndDelete({
        author: user._id,
        _id: id,
      });
      return res.status(200).json({
        post,
        success: true,
        message: "Post is Deleted Successfully",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Unable to Delete the post.",
      });
    }
  }
);

export default router;
