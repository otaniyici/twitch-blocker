const axios = require("axios");
const fs = require("fs");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const AUTH = {};

// "/auth/twitch"
exports.getAuthCode = (req, res) => {
  const scopes =
    "user%3Amanage%3Ablocked_users+user%3Aread%3Ablocked_users+user%3Aread%3Aemail";
  const redirect_uri = "http://localhost:3000/auth/twitch/success";
  res.redirect(
    `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scopes}`
  );
};

// "/auth/success"
exports.getAccessToken = async (req, res) => {
  // authorization code
  const auth_code = req.query.code;
  // use auth cod to get access token
  const { data } = await axios({
    method: "POST",
    url: "https://id.twitch.tv/oauth2/token",
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: auth_code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3000",
    },
  });
  // access token
  AUTH["ACCESS_TOKEN"] = data.access_token;
  res.json({ msg: "success" });
};

exports.AUTH = AUTH;
