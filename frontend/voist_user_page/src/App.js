import React from "react";
import { Search } from "./Components/Search.component";
import * as firebase from "firebase/app";
import "firebase/database";
import { useList } from "react-firebase-hooks/database";
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
export const database = firebase.database();
function App() {
  // Use local storage to store the playlist id which can be reused as modify playlist required
  database
    .ref("playlistID")
    .once("value")
    .then(snapshot => {
      localStorage.setItem("spotifyplaylistid", snapshot.val());
    });
  const [trackList] = useList(database.ref("tracks"));
  return (
    <div>
      <Search />
      <ul className="tracklist">
        {trackList.map(el => (
          <li className="track" key={el.val().id} id={el.val().id}>
            {el.val().name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
