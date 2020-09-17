import mongoose from "mongoose";
import session from "express-session";
import connectMongo from "connect-mongo";
import { v4 as uuidv4 } from "uuid";
import { log } from "debug";
import CustomError from "../utils/customError";
import responseHandler from "../utils/responseHandler";
const mongoStoreFactory = connectMongo(session);

// persist session to storage
const sessionStore = new mongoStoreFactory({
  mongooseConnection: mongoose.connection,
  collection: "sessions",
});

const sess = {
  store: sessionStore,
  genid: function () {
    return uuidv4(); // use UUIDs for session IDs
  },
  secret: "ilovemysecretassecret",
  saveUninitialized: false,
  resave: false,
  rolling: true,
  cookie: {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000, //1 hour
  },
  name: "user_sid",
};

class SessionManagement {
  async config(app) {
    if (app.get("env") === "production") {
      app.set("trust proxy", 1); // trust first proxy
      sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));
  }

  async checkSession(req, res, next) {
    if (req.session.isLoggedIn) {
      // validate login with session cookie

      try {
        const sess = await sessionStore.get(req.session.id);
        if (!sess) {
          next(new CustomError(400, "Invalid Session, try login again"));
          return;
        }
      } catch (error) {
        log("Session Error: " + error.message);
      }

      responseHandler(
        res,
        200,
        {},
        "User is already logged in, redirecting ..."
      );
      return true;
    } else {
      return false;
    }
  }
  // create new session for user on login
  async signin(req, res, user, next) {
    // on login, check session store if session id exists
    const isLoggedIn = await this.checkSession(req, res, next);
    if (!isLoggedIn) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.flag = {
        remoteAddress: req.ip,
      };
      sessionStore
        .set(sess.genid(), req.session)
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
      // eslint-disable-next-line curly
      if (!session) {
        next(new CustomError(400, "Couldn't refresh user session. Try again"));
        return;
      }
    }
  }

  async signout(req) {
    sessionStore
      .destroy(req.session.id)
      .then(() => {
        req.session.destroy();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export default new SessionManagement();
