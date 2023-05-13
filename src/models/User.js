import { hash, compare } from "bcrypt";
import { Schema, model } from "mongoose";
import { pick } from "lodash";
import { sign } from "jsonwebtoken";
import { SECRET } from "../config";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) {
    next();
  }

  user.password = await hash(user.password, 10);
});

UserSchema.methods.passwordCompare = async function (password) {
  const isMatch = await compare(password, this.password);
  return isMatch;
};

UserSchema.methods.getUser = function () {
  return pick(this, ["username", "email", "firstName", "lastName", "_id"]);
};

UserSchema.methods.issueToken = function () {
  const token = sign(this.getUser(), SECRET, { expiresIn: "1 Day" });
  return token;
};

const User = model("users", UserSchema);
export default User;
