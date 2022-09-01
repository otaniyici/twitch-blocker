const axios = require("axios");
const { refreshToken } = require("./authController");

const CLIENT_ID = process.env.CLIENT_ID;
const AUTH = require("./authController").AUTH;

let blockedCount = 0;

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

const getUserSubs = async (broadcaster_id, cursor) => {
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
        broadcaster_id,
        after: cursor,
        first: 100,
      },
    });
    console.log(response.data);

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

const blockUser = async (target_user_id, interval) => {
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

    if (response.status === 204) {
      blockedCount++;
      // return console.log(response.status, " : ", target_user_id);
    }
  } catch ({ response }) {
    // console.log("ERROR STATUS: ", response.status);
    if (response.status === 401) {
      await refreshToken();
      await blockUser(target_user_id, interval);
    }
    if (response.status === 400) {
      await blockUser(target_user_id, interval);
    }
    if (response.status === 429) {
      // console.log("Trying again: ", target_user_id);
      // console.log("interval: ", interval);
      setTimeout(() => {
        blockUser(target_user_id, interval + 500);
      }, interval);
    }
  }
};

// "/users/blocks/:username"
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

exports.get_user_subs = async (req, res) => {
  const streamer = await getUser(req.params.login_name);
  const data = await getUserSubs(streamer.data[0].id);
  res.json({
    data,
  });
};

// "/users/blocks/:login_name"
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
  // block the Users
  await Promise.all(
    followers.map((follower) => {
      return blockUser(follower.from_id, 1000);
    })
  );
  console.log(blockedCount);
  res.json({
    cursor,
  });
};
