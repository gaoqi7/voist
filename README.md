# Voist

## why Voist

Voist is an app initially designed for party use. the voist name is comming from **Vo**[te playl]**ist**, which means the party music playlist will be created by vote. It is a refactory project of [Hype](https://github.com/Epiphamatic/Project-2).

## Why refactory

- Use the latest tools to build this app.
  - React, React Hook, SASS, Firebase
  - MVC framework
  - `List` data structure in JavaScript
- Deeper understanding the ExpressJS framework
  - the magic of the middleware

## How it works

#### [DEMO](https://youtu.be/_HqrKJAEOSg)

- There are 4 entities have relation with application Voist.

  - Party host
  - Party host's spotify
  - Party host's firebase database
  - Party attendee

- Workflow

  - Voist get Party Host's authorization through spotiy's Oauth 2.0 procedure
  - Voist get Party Host's playlist
  - Party Host pick the playlist which can be use on party
  - The track list inside playlist will be sent to firebase
  - Party Attendee can add track to the playlist by inputting the track name in search bar
  - The new added track will be added to spotify and firebase successively; And shows on the user page at the same time.

- Tech Stack
  - NodeJS
  - React / React Hook
  - Material-UI
  - Oauth 2
  - Socket Connnection
  - Firebase
  - Spotify API
  - ExpressJS
  - JavaScript
