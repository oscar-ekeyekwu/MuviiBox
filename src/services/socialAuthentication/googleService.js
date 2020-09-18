import { google } from "googleapis";

/**
 * This service is responsible for managing the OAuth Client for Google authentication.
 */
export default class GoogleService {
  authenticate(socialCallbackUrl) {
    this._socialCallbackUrl = socialCallbackUrl;
    this._clientID = process.env.GOOGLE_CLIENT_ID;
    this._clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this._initializeOAuth2Client();
    this._cacheOAuth2Client();
  }

  // Initialize the client.
  _initializeOAuth2Client() {
    this.oauth2Client = new google.auth.OAuth2(
      this._clientID,
      this._clientSecret,
      `${process.env.HOST}api/users/social/google/callback`
    );
  }

  // Cache the client.
  _cacheOAuth2Client() {
    cache[this._clientID] = {
      oauth2Client: this.oauth2Client,
      socialCallbackUrl: this._socialCallbackUrl,
    };
  }

  // Returns scopes for a Google user's information and email address.
  _getScopes() {
    return [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
  }

  // Returns a authentication URL that will initiate Google's authentication flow through their servers.
  getAuthenticationUrl() {
    return this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",

      // If you only need one scope you can pass it as a string
      scope: this._getScopes(),

      // Add the client ID to ensure the correnct credentials are used on server response (callback)
      state: this._clientID,
    });
  }

  // Returns the formatted profile of the authenticated Google user and a redirect callback.
  async getData(clientID, code) {
    try {
      const { oauth2Client, socialCallbackUrl } = cache[clientID];

      // Delete cached client.
      cache[clientID] = null;

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const res = await oauth2.userinfo.get();

      const profile = {
        googleId: res.data.id,
        firstname: res.data.given_name,
        lastname: res.data.family_name,
        email: res.data.email,
        isVerified: res.data.verified_email,
        photo: res.data.picture,
      };

      return {
        profile,
        socialCallbackUrl,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

/**
 * This cache stores clients for use on the callback received from Google.
 */
const cache = {};
