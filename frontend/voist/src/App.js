import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { Playlist } from "./Components/Playlist/Playlist.component";

const url_query = queryString.parse(window.location.search);
const tokenInfo = {
  token_type: `${url_query.token_type}`,
  access_token: `${url_query.access_token}`,
  refresh_token: `${url_query.refresh_token}`
};
function App() {
  const [playlist, setPlaylist] = useState([]);
  // const [tokens, setTokens] = useState(tokenInfo);
  // Fetch the Playlist
  useEffect(() => {
    const option = {
      headers: {
        Authorization: `${url_query.token_type} ${url_query.access_token}`
      },
      method: "get"
    };
    const fetchPlaylist = async () => {
      const response = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        option
      );
      const resJson = await response.json();
      setPlaylist(resJson.items);
    };
    fetchPlaylist();
  }, []);
  return (
    <div className="App">
      <Playlist tokenInfo={tokenInfo} playlistContent={playlist} />
    </div>
  );
}

export default App;
