import React, { useState, useEffect } from "react";
import { database } from "../App";
import { Autocomplete } from "@material-ui/lab";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));
export const Search = () => {
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const [tList, settList] = useState({
    tracks: { items: [{ name: "input music name" }] }
  });
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
        settList(resJson);
        console.log(resJson);
      };

      const queryAction = async () => {
        await fetchToken();
        await querySearch();
      };
      queryAction();
    } else {
      settList({
        tracks: { items: [{ name: "input music name" }] }
      });
    }
  }, [query]);
  return (
    <Autocomplete
      options={tList.tracks.items}
      // After the user confirm the selection, it change the input value as none.
      getOptionLabel={() => ""}
      filterOptions={x => x}
      includeInputInList
      style={{ width: 360 }}
      freeSolo
      disableOpenOnFocus
      renderInput={params => (
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item style={{ width: 300 }}>
            <TextField
              {...params}
              label="Input Music Name"
              variant="standard"
              fullWidth
              onChange={e => setQuery(e.target.value)}
            />
          </Grid>
        </Grid>
      )}
      renderOption={option => {
        // After click, first update spotify then update firebase
        const handleOnClick = async () => {
          let pl_id = localStorage.getItem("spotifyplaylistid");
          let accto;
          let toty;
          await database
            .ref("token")
            .once("value")
            .then(function(snapshot) {
              accto = snapshot.val().access_token;
              toty = snapshot.val().token_type;
            });
          const opt = {
            method: "POST",
            headers: {
              Accept: "application-json",
              Authorization: `${toty} ${accto}`
            },
            body: JSON.stringify({ uris: [`${option.uri}`] })
          };
          await fetch(
            `https://api.spotify.com/v1/playlists/${pl_id}/tracks`,
            opt
          );
          database.ref("tracks").push({ id: option.id, name: option.name });
        };
        return (
          <Grid
            container
            onClick={handleOnClick}
            alignItems="center"
            data-uri={option.uri}
          >
            <Grid item>
              <MusicNoteIcon className={classes.icon} />
            </Grid>
            <Typography variant="body2" color="textSecondary">
              {option.name}
            </Typography>
          </Grid>
        );
      }}
    ></Autocomplete>
  );
};
