# Face Command

Face Command runs commands based on the presence or absence of a face recognized by a camera. The example use-case is locking the computer if the user looks/walks away. The application uses OpenCV for facial recognition.

## Running

To give it a whirl you can build an executable yourself by running `npm run build` or to just run `npm start`.

## Components

Face Command is comprised of four seperate projects:

| Name                                                                   | Description                                      |
|------------------------------------------------------------------------|--------------------------------------------------|
| [face-command-server](https://github.com/znetstar/face-command-server) | Back-end logic, all the heavy lifting.           |
| [face-command-web](https://github.com/znetstar/face-command-web)       | Angular-based web interface.                     |
| [face-command-client](https://github.com/znetstar/face-command-client) | JavaScript RPC client.                           |
| [face-command-common](https://github.com/znetstar/face-command-common) | Common classes and logic shared by all projects. |

Refer to each the documentation/source of each component for more info.

## Disclaimer

This project is really a proof-of-concept.
More documentation is coming soon.