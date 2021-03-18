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

### Release New Version

Run the following command to create a new tagged release.

```sh
npm version <major|minor|patch>
```

A new git branch `chore/release-${VERSION}` will be pushed. Create PR and merge into `develop` branch (merge not squash to keep the tag).

Cloud Build will build and upload a new develop version once merged (https://storage.googleapis.com/esa-cfs-versions/web/develop/index.html)

Merge `develop` into `master`. Once merged Cloud Build will build and upload new master version (https://storage.googleapis.com/esa-cfs-versions/web/master/index.html).

Copy the master web application files into a separate version folder
`gsutil cp -r gs://esa-cfs-versions/web/master/* gs://esa-cfs-versions/web/{VERSION}/`

Trigger the electron build task on Cloud build for the master branch (https://console.cloud.google.com/cloud-build/triggers?project=esa-climate-from-space)

Copy the master electron application files into a separate version folder
`gsutil cp -r gs://esa-cfs-versions/electron/master/* gs://esa-cfs-versions/electron/{VERSION}/`

In addition all remote files on cloud storage have to be updated to the new version folder. Run the follwing command with the correct version numbers:

```sh
./increase-storage-version <old_version> <new_version> # e.g. increase-storage-version 0.9.3 1.0.0
```

## Contact

- PM Ubilabs: Patrick Mast <mast@ubilabs.net>
- Dev Ubilabs: Philipp Wambach <wambach@ubilabs.net>
- Dev Ubilabs: Katherina Marcenko <marcenko@ubilabs.net>
