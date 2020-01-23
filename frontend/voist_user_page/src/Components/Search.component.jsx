import React, { useState, useEffect } from "react";
import { database } from "../App";
import { useObjectVal } from "react-firebase-hooks/database";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [atoken] = useObjectVal(database.ref("token/access_token"));
  useEffect(() => console.log(atoken), [atoken]);
  useEffect(() => {
    console.log(query);
    const option = {
      method: "get",
      headers: { Authorization: `Bearer ${atoken}` },
      // q: query,
      // type: "track",
      limit: 7,
      offset: 5
    };
    const fetchSearchResult = async () => {
      if (query.length >= 4) {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track&limit=7&offset=5`,
          option
        );
        const resJson = await response.json();
        console.log(resJson);
      }
    };
    fetchSearchResult();
  }, [query]);
  return (
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
  );
};
