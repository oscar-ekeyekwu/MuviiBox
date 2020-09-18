import GoogleService from "../services/socialAuthentication/googleService";
import { InternalServerError } from "../utils/customError";
// import responseHandler from "../utils/responseHandler";
import url from "url";

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

      res.redirect(redirectUrl);
    } catch (error) {
      next(new InternalServerError(error));
    }
  }
}

export default new SocialAuthController();
