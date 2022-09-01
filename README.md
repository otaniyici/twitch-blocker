# Twitch-Blocker

---

Twitch-Blocker is a server side application with simple client script for blocking certain twitch user's followers.

## Usage

To get a local copy up and running you can either clone the repository or download the zip file. Before starting the server application rename temp.env to .env and add your client id,client secret and username to block followers of. Also add "http://localhost:3000/auth/twitch/success" to applications OAuth Redirect URLs at your developer console. Install dependencies. Start the server application.

```
    npm install
    npm start
```

Go to "http://localhost:3000/auth/twitch" on your browser. Login with your twitch account. Then you can run the client.js to start blocking users.

```
    node client.js
```

## How Does it Work?

User authorizes the application with going to "http://localhost:3000/auth/twitch". Application gets the access token with necessary permissions. Client.js script makes request to "http://localhost:3000/users/blocks/:username" every 8 seconds. Every request, server fetches 100 followers of the specified user. Then, fetched users gets blocked from the signed in user.

## Limitations

Since Twitch API has a rate limit of 800 points per minute client.js only makes 100 request every 8 seconds. In case a request does not get through because of too many requests, server sends the same request by increasing intervals starting with 1 second.
