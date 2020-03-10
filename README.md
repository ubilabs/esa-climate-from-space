# Climate from Space application for ESAs CCI+ program.

## Web Version

- Staging: https://storage.googleapis.com/esa-cfs-versions/web/develop/index.html
- Live: https://storage.googleapis.com/esa-cfs-versions/web/master/index.html
- Releases: https://storage.googleapis.com/esa-cfs-versions/web/${VERSION}/index.html (e.g. `${VERSION} = 0.4.0`)

## Desktop App

Besides the web version we also deliver a native Electron app to download and run on a local machine. This app also offers a "Safe for Offline Usage" feature which allows to download data and view it later without an active internet connection.

The native app releases can be downloaded from:

- Windows https://storage.googleapis.com/esa-cfs-versions/electron/${VERSION}/esa-climate-from-space-${VERSION}-win.exe
- MacOs https://storage.googleapis.com/esa-cfs-versions/electron/${VERSION}/esa-climate-from-space-${VERSION}-mac.zip
- Linux https://storage.googleapis.com/esa-cfs-versions/electron/${VERSION}/esa-climate-from-space-${VERSION}-linux.zip

Note: Be sure to replace the `VERSION` number e.g. (`0.4.0` -> `https://storage.googleapis.com/esa-cfs-versions/electron/0.4.0/esa-climate-from-space-0.4.0-win.exe`)

### Installation

To run the native app just run the `.exe` file (Windows) or unpack the `.zip` archive (Linunx/MacOS) and run the containing app/binary file. Versions < 1.0.0 are not signed and may prompt a Security Warning from your Operating System.

## Development

### Requirements

Following software is required to develop for this project:

- `node.js (>= 10)`
- `npm`

### Installation

After cloning the repository, install all dependencies:

```sh
npm install # install new dependencies
```

### Run

Run the following command to start the server on localhost:

```sh
npm start # start the server
```

### Build Web

Run the following command to build a production ready version of the web part:

```sh
npm run build
```

The final output will be in a folder called `dist` in the project's root directory.

### Build Native Electron App

Run the following command to build a production ready version of the electron part:

```sh
npm run electron:build
```

The final output will be in a folder called `dist-electron` in the project's root directory.

## Contact

- PM Ubilabs: Patrick Mast <mast@ubilabs.net>
- Dev Ubilabs: Philipp Wambach <wambach@ubilabs.net>
- Dev Ubilabs: Katherina Marcenko <marcenko@ubilabs.net>
