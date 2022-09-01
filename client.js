const axios = require("axios");

let cursor;

const intervalId = setInterval(async () => {
  try {
    const url = `http://localhost:3000/users/blocks/${process.env.BLOCK_USERNAME}`;
    const { data } = await axios({
      method: "post",
      url: url,
      data: {
        cursor,
      },
    });

    // console.log("CLIENT SENT:", cursor);
    if (data.cursor) {
      if (data.cursor === cursor) {
        clearInterval(intervalId);
      }
      cursor = data.cursor;
    }
  } catch (error) {
    console.log(error);
  }
}, 8000);
