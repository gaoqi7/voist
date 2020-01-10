import React from "react";

export const Song = props => {
  return (
    <ul>
      {props.tracks.map(el => {
        return (
          <li key={el.track.id}>
            <button>{el.track.name}</button>
          </li>
        );
      })}
    </ul>
  );
};
