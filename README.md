# Hodors Ascension
The "definitive" version of my discord bot (hopefully with lots of improvements)


## Description
This is a bot I designed mainly to interact with my minecraft server. I may add some more features in the future but I'd like to keep it's scope on the focused side. This is the (fourth?) full rewrite of the Hodor discord bot. The current one is essentially on life support, and this one is meant to fully supplant it.


## Usage
This bot works through slash "/" commands. That's right! No more "?mc stat ... wait no, ?mc status ... maybe, ?mc statistics" (it was ?mc stats). All interactions are through slash commands now. Here's a guide:

* /status
    * This retrievs the status of the minecraft server.
* /start
    * This starts the minecraft server


## Roadmap
This is a general plan for features that I'll add to this bot. It isn't set in stone, meaning I might add or remove features whenever.

### Complete (might still add to them later, but they're where they need to be)
* Minecraft:
     * Starting the server
    * Viewing server statistics

### Work in progress (still under development / incomplete)
Nothing at the moment.

### Planned (I plan to add these (not a guarantee, but it's likely))
* Music:
    * Youtube support
    * Queue / player interaction

### Possible (I dont plan to add these per-se, they're just cool ideas i might develop given the time) - I'm open to suggestions :)
* Inspirobot


## Build Instructions
Building this bot from source should be possible on all platforms. Please make sure you have access to a POSIX shell. This is the default for Mac and Linux (if you are using one of these you can go ahead). If you're on windows, install `git bash`. Once you're in, go ahead.

### Dependencies
The only system-level dependencies this bot has is `node.js` and `npm`. These commands should help with installation (assuming you have a package manager on your system ... *cough cough* Windows and Mac *cough cough*)

#### Debian
```bash
sudo apt install nodejs npm
```
#### Arch
```bash
sudo pacman -S nodejs npm
```
#### OSX / Mac OS
```bash
brew install nodejs npm
```
#### Windows
```cmd
choco install nodejs
```

### Cloning the source code
Next! Clone the repository *(believe it or not, this is important for compiling from source code)*

```bash
git clone https://github.com/KCGD/discord-bot-fr-this-time.git
cd discord-bot-fr-this-time
```

### Getting the npm dependencies
This is probably the easiest part of this entire guide

Just run `npm i` *(if this fails, make sure your npm is up to date!)*

### Setting up the dev environment
#### Defining keys and endpoints (optional, sort of)
This step is optional if you only need to compile the code (it will compile but **wont** run). For a fully functional version of this bot, this step is **required**.

Create a file named `.vars` in the project's root directory *(where you should be right now)* and copy this into it:
```bash
#!/bin/sh
export DISCORD_BOT_API_KEY=[your discord bot token here]
export MC_SERVER_ENDPOINT=[your server here]
```
Fill in the relevant fields and you're good to go.

### Setting up the commands
Run the following in your shell to set up the relevant commands and variables to build this program:
```bash
source .env
```
This may throw an error if you skipped the previous step, however this error is harmless.

### Building the code
Finally! We made it! Now go ahead and start the build process using the `nbuild` command. This process takes ~30 seconds on my laptop but may take longer or shorter depending on your platform / hardware specs.

Once this is done, you should have  an executable neatly placed in the `Builds` directory.

## Contributing
This project is open source! Meaning you are free to contribute your own work (features, bug fixes, refactors, etc). Please keep to the general structures and naming conventions of the project. 

## License
This project is proudly hosted under the Gnu General Public License (GPL) v2.0 :)