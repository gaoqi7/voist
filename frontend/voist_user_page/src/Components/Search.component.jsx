import React, { useState, useEffect } from "react";
import { database } from "../App";
import { useObjectVal } from "react-firebase-hooks/database";
// import { TrackQueryResult } from "./TrackQueryResult/TrackQueryRusult.component";
export const Search = () => {
  const [query, setQuery] = useState("");
  const [atoken] = useObjectVal(database.ref("token/access_token"));
  const [tqResult, set_tqResult] = useState([]);
  useEffect(() => console.log(atoken), [atoken]);
  useEffect(() => {
    console.log(query);
    const option = {
      method: "get",
      headers: { Authorization: `Bearer ${atoken}` }
    };
    const fetchSearchResult = async () => {
      if (query.length > 5) {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track&limit=7&offset=5`,
          option
        );
        const resJson = await response.json();
        console.log(resJson.tracks.items);
        set_tqResult(resJson.tracks.items);
      }
    };
    fetchSearchResult();
  }, [query]);
  return (
    <>
      <form>
        <label>
          Search:
          <input
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            name="name"
          />
        </label>
      </form>
      <ul>
        {tqResult.length > 0 &&
          query.length > 5 &&
          tqResult.map(e => (
            <li key={e.id} id={e.id}>
              {e.name}
            </li>
          ))}
      </ul>
    </>
  );
};
