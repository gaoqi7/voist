import React, { useState, useEffect } from "react";
import { database } from "../App";
export const Search = () => {
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (query.length >= 3) {
      let accessToken;
      let tokenType;
      const fetchToken = async () => {
        const res = await database.ref("token").once("value");
        accessToken = await res.val().access_token;
        tokenType = await res.val().token_type;
        console.log(accessToken);
        console.log(tokenType);
      };

      const querySearch = async () => {
        let opt = {
          method: "GET",
          headers: {
            Authorization: `${tokenType} ${accessToken}`
          }
        };
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=track`,
          opt
        );
        const resJson = await res.json();
        console.log(resJson);
      };

      const queryAction = async () => {
        await fetchToken();
        await querySearch();
      };
      queryAction();
    }
  }, [query]);
  return (
    <form>
      <label>
        Search:
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          name="name"
        />
      </label>
    </form>
  );
};
