import React, { useState, useEffect } from "react";
import { Song } from "../Song/Song.component";
export const Playlist = props => {
  const [isClicked, setIsClicked] = useState(false);
  const [trackList, setTrackList] = useState([]);
  useEffect(() => console.log(trackList), [trackList]);
  const handleClick = e => {
    setIsClicked({ isClicked: true });
    const fetchTracks = async () => {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${e.target.getAttribute(
          "pl_id"
        )}/tracks`,
        {
          method: "get",
          headers: {
            Authorization: `${props.tokenInfo.token_type} ${props.tokenInfo.access_token}`
          }
        }
      );
      const resJson = await response.json();
      setTrackList(resJson.items);
    };
    fetchTracks();
  };
  return (
    <div>
      {isClicked === false &&
        props.playlistContent.map(pl => (
          <button
            onClick={handleClick}
            className="playlistBtn"
            key={pl.id}
            pl_id={pl.id}
          >
            {pl.name}
          </button>
        ))}
      {isClicked && <Song tracks={trackList} />}
    </div>
  );
};
