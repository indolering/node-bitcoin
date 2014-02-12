# Setup Instructions
`nmc.js` first checks for a passed config object, then it checks for a local
`settings.json` file and it finally falls back to searching for the config file
at `~/.namecoin/namecoin.conf`. This should "just work" on most Unix systems. *

## To a manually specify settings:
1. Add `settings.json` to `.gitignore`
2. Backup `settings-example.json` and then rename it `settings.json`
3. Fill in config information in `settings.json`

* It technically looks for the `/.namecoin/namecoin.conf` file in whatever
directory is listed in the `process.env.HOME` variable.