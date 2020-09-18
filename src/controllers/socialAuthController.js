import GoogleService from "../services/socialAuthentication/googleService";
import { InternalServerError, CustomError } from "../utils/customError";
// import responseHandler from "../utils/responseHandler";
import url from "url";
import Users from "../models/users";

class SocialAuthController {
  /**
   * Controller responsible for returning an authentication URL for the client
   * to initiate the Google's authentication flow.
   */
  async googleAuthController(req, res, next) {
    try {
      const googleService = new GoogleService();
      googleService.authenticate();
      const authenticationUrl = googleService.getAuthenticationUrl();

      // responseHandler(res, 200, { authenticationUrl });
      res.redirect(authenticationUrl);
    } catch (error) {
      next(new InternalServerError(error));
    }
  }

  /**
   * Controller responsible for handling the callback from Google's authentication flow and
   * returning the user data to the client via a redirect to the client's provided
   * socialCallback.
   */
  async googleAuthCallbackController(req, res, next) {
    try {
      // The state contains the client ID.
      const { state, code } = req.query;

      const googleService = new GoogleService();
      const { profile, socialCallbackUrl } = await googleService.getData(
        state.toString(),
        code
      );

      let redirectUrl;

      if (profile && profile.googleId) {
        redirectUrl = url.format({
          pathname: socialCallbackUrl,
          query: {
            success: true,
            id: profile.googleId,
            isVerified: profile.isVerified,
            firstname: profile.firstname,
            lastname: profile.lastname,
            email: profile.email,
            photo: profile.photo,
          },
        });
      } else {
        redirectUrl = url.format({
          pathname: socialCallbackUrl,
          query: { success: false },
        });
      }
      const authDetails = {
        provider: "google",
        profileImageUrl: profile.photo,
      };

      //save authenticated user in application database
      try {
        const user = new Users({
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
          auth: authDetails,
        });
        await user.save();
      } catch (error) {
        const errorType =
          error.code === 11000
            ? ": User account already exists"
            : `\n Error: ${error.message}`;

        next(
          new CustomError(
            400,
            `An error occured creating user account.  ${errorType}`
          )
        );
        return;
      }
      res.redirect(redirectUrl);
    } catch (error) {
      next(new InternalServerError(error));
    }
  }
}

export default new SocialAuthController();
