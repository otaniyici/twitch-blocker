const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID;
const AUTH = require("./authController").AUTH;

const getUser = async (login) => {
  try {
    const url = "https://api.twitch.tv/helix/users";
    const { data } = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${AUTH.ACCESS_TOKEN}`,
        "Client-Id": `${CLIENT_ID}`,
      },
      params: {
        login,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUserFollowers = async (to_id, cursor) => {
  try {
    const url = "https://api.twitch.tv/helix/users/follows";
    const response = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${AUTH.ACCESS_TOKEN}`,
        "Client-Id": `${CLIENT_ID}`,
      },
      params: {
        after: cursor,
        to_id,
        first: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getUserSubs = async (broadcaster_id) => {
  try {
    const url = "https://api.twitch.tv/helix/subscriptions";
    const response = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${AUTH.ACCESS_TOKEN}`,
        "Client-Id": `${CLIENT_ID}`,
      },
      params: {
        after: cursor,
        first: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getUserBlocks = async (broadcaster_id) => {
  try {
    const url = "https://api.twitch.tv/helix/users/blocks";
    const response = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${AUTH.ACCESS_TOKEN}`,
        "Client-Id": `${CLIENT_ID}`,
      },
      params: {
        broadcaster_id,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const blockUser = async (target_user_id) => {
  try {
    const url = "https://api.twitch.tv/helix/users/blocks";
    const response = await axios({
      method: "put",
      url: url,
      headers: {
        Authorization: `Bearer ${AUTH.ACCESS_TOKEN}`,
        "Client-Id": `${CLIENT_ID}`,
      },
      params: {
        target_user_id,
      },
    });
    if (response.status === 401) {
    }
    if (response.status !== 204) {
      return res.json({});
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

//"/users/blocks/:username"
exports.get_user_blocks = async (req, res) => {
  try {
    const user = await getUser(req.params.username);
    const data = await getUserBlocks(user.data[0].id);
    res.json({
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

//"/users/blocks/:login_name"
exports.post_user_blocks = async (req, res) => {
  const streamer = await getUser(req.params.login_name);
  const STREAMER_TO_BLOCK = streamer.data[0].id;
  // get followers of streamer
  let follower_data;
  if (req.body.cursor) {
    follower_data = await getUserFollowers(STREAMER_TO_BLOCK, req.body.cursor);
  } else {
    follower_data = await getUserFollowers(STREAMER_TO_BLOCK);
  }
  // cursor for pagination
  const cursor = follower_data.pagination.cursor;
  const followers = follower_data.data;
  // Block the Users
  await Promise.all(
    followers.map(async (follower) => {
      await blockUser(follower.from_id);
    })
  );

  res.json({
    cursor,
  });
};
