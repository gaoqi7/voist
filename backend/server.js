require("dotenv").config();
require("firebase/database");
const firebase = require("firebase/app");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3300;
app.use(cors());
// Setup express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const request = require("request");
const bufferFrom = require("buffer-from");
const firebaseConfig = {
  apiKey: "AIzaSyDOxTtEvEitywMgv5qLST7O5dlC5dfb7L8",
  authDomain: "voist-3b822.firebaseapp.com",
  databaseURL: "https://voist-3b822.firebaseio.com",
  projectId: "voist-3b822",
  storageBucket: "voist-3b822.appspot.com",
  messagingSenderId: "776071379957",
  appId: "1:776071379957:web:8daafba54054045df03ebc",
  measurementId: "G-H3LXYVEF8Y"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const tokenInfo = {};

function autoUpdateToken() {
  let option = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "refresh_token",
      refresh_token: tokenInfo.refresh_token
    },
    headers: {
      Authorization:
        "Basic " +
        bufferFrom(
          process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  request.post(option, function(error, request, body) {
    tokenInfo.access_token = JSON.parse(body).access_token;
    database.ref("token").update({ access_token: tokenInfo.access_token });
  });
}

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
    tokenInfo.access_token = JSON.parse(body).access_token;
    tokenInfo.refresh_token = JSON.parse(body).refresh_token;
    tokenInfo.token_type = JSON.parse(body).token_type;
    tokenInfo.expires_in = JSON.parse(body).expires_in;
    tokenInfo.scope = JSON.parse(body).scope;
    console.log("this is the init token!!!!");
    console.log(tokenInfo);
    let uri = process.env.FRONTEND_URI || "http://localhost:3000";
    database.ref("token").set(tokenInfo);
    res.redirect(
      uri +
        "?access_token=" +
        tokenInfo.access_token +
        "&refresh_token=" +
        tokenInfo.refresh_token +
        "&token_type=" +
        tokenInfo.token_type
    );
  });
  setInterval(autoUpdateToken, 40000);
});

app.post("/playlist", function(req, res) {
  const tracksInfo = req.body.data.map(el => {
    return {
      name: el.track.name,
      id: el.track.id
    };
  });
  console.log(tracksInfo);
  database.ref("tracks").set(tracksInfo);
  database.ref("playlistID").set(req.body.pl_id);
  res.send("test");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
