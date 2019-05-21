# server_js
This was built in conjunction with a music player app written in react native that queries the server for the files.
The design was based around music downloaded from iTunes & has only been tested to run on node clients using `socket.io-client`.

## Usage
After you clone the project, `cd` into the directory. The program takes an argument that's the filepath of the directory where all the music lives. On connection, it sends a `handshake` event as a confirmation (sanity testing), and then waits for a `refresh` event to then perform the indexing & serving of the files.

to run:
`node server.js "/path/to/library/"`
or modify the `package.json` start command to include the path & run `npm start`

Because of the design paradigm the project assumes the file structure 
```
/path/to/downloaded/itunes music/[artist]/[album]/[song.m4a]
``` 
& uses that to parse the filenames into a list of objects. Modifications will be necessary if your file structure is different.

After running, point your client app to the server & set up the websocket events to communicate with the server. I hardcoded the port to `8765` for the time being, but it can be changed. My specific setup is as follows:

```
let socket = io.connect('http://ip.to.server.instance:8765');

socket.on('connection', console.log('connected to server!'));

socket.on('handshake', data => {
  console.log('server responded with: ' + data.message);
  socket.emit('refresh');
});

socket.on('refresh', console.log);

socket.on('error', console.error);
```
## Tests
coming in the next few updates.
