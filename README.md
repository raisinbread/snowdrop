# Snowdrop

Snowdrop is a Node.js utility that watches a local folder for changes and acts as files in that folder change. Among other things, snowdrop can:

  - Rsync files after you edit them in VIM
  - Update your tag file as files change
  - Run commands on init to start VIM or clear caches

Snowdrop was built as a sidecar utility for VIM to allow me to work locally with files that are remote. Because some of the applications I work on aren't easily hosted locally, I needed something that lets me take advantages of neato VIM plugins and features ([CtrlP](https://github.com/kien/ctrlp.vim), [NERDTree](https://github.com/scrooloose/nerdtree), tags) as if I was running them on the local system.

Snowdrop will ask for info about a remote folder, pull those files down, and watch as you make change so that files can be pushed to the remote machine and ctags files can be updated.

## Setup

Requires a very recent version of Node.js. This was build using
[v0.9.10](http://nodejs.org/dist/v0.9.10/). Tested on Mac OS X 10.8.

Requres rsync and (exuberant) ctags if you plan to use them.

To install, run:

     $ npm install -g snowdrop

Works best with remote systems where you have ssh keys installed.

## Using Snowdrop

To use snowdrop, create a new local directory and run `snowdrop`:

     $ mkdir project; cd project && snowdrop

Follow the prompts to continue the setup process:

![setup](http://i.imgur.com/4ncFWji.png)

Finally, run `snowdrop` in the project directory to start the monitoring
process. As a files changes, is added, or is removed, snowdrop runs the
configured commands (usually at least an rsync and ctags).

![snowdrop-in-action](http://i.imgur.com/H16wg8p.png)

Run `snowdrop -u` to rsync the remote files to the local system.

## Configuration

After snowdrop is initialized, a file named `.snowdrop.json` appears in
the current working directory. You can edit this file to change how
snowdrop reacts to changes in the filesystem.

The config file contains a JSON object with the following properties:

- `source`: The local directory to sync. Shouldn't normally be changed.
- `destination`: The remote folder to sync to. Set to `false` if you do
  not want to use rsync.
- `port`: The port of your server.
- `ignore`: If a regular expression in this array matches a filename,
  snowdrop will not act when that file changes. Ignores `.git` and
  `tags` by default.
- `init`: Commands to run when snowdrop is started.
- `rsync`: Flags and options used when snowdrop rsyncs the source to the
  destination.
- `ctags`: Set to `true` if ctags should be used to create a file named
  `tags` in the current working directory.

## Contributing changes

- Fork and send pull requests
- Submit issues

## License

MIT
