import passport from "passport";
import { User } from "../models";
import { Strategy, ExtractJwt } from "passport-jwt";
import { SECRET as secretOrKey } from "../config";

const opts = {
  secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(opts, async ({ _id }, done) => {
    try {
      let user = await User.findById(_id);
      if (!user) {
        throw new Error("User not found.");
      }
      return done(null, user.getUser());
    } catch (err) {
      done(null, false);
    }
  })
);
