require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3300;
const request = require("request");
const bufferFrom = require("buffer-from");

app.get("/login", function(req, res) {
  const scopes =
    "playlist-modify-public user-read-currently-playing playlist-modify-private";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      process.env.CLIENT_ID +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(process.env.REDIRECT_URI)
  );
});
app.get("/callback", function(req, res) {
  const code = req.query.code;
  const option = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.REDIRECT_URI
    },
    headers: {
      Authorization:
        "Basic " +
        bufferFrom(
          process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
        ).toString("base64")
    }
  };
  request.post(option, function(error, response, body) {
    console.log(JSON.parse(body).access_token);
    let access_token = JSON.parse(body).access_token;
    let refresh_token = JSON.parse(body).refresh_token;
    let token_type = JSON.parse(body).token_type;
    let uri = process.env.FRONTEND_URI || "http://localhost:3000";
    res.redirect(
      uri +
        "?access_token=" +
        access_token +
        "&refresh_token=" +
        refresh_token +
        "&token_type=" +
        token_type
    );
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
