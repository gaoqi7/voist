import React from "react";
import logo from "./logo.svg";
import queryString from "query-string";
import request from "request";
import "./App.css";
const url_query = queryString.parse(window.location.search);
const option = {
  url: "https://api.spotify.com/v1/me/playlists",
  headers: {
    Authorization: `${url_query.token_type} ${url_query.access_token}`
  }
};
function App() {
  console.log(url_query);
  request.get(option, (error, request, body) => {
    console.log(JSON.parse(body));
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>FFFFFFFFFFFFFFFFf</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
