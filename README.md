# wardrobe
## Installation

Ways of installation differ, but this is the way I'd do it.
### 1. Clone the repository
```sh
git clone https://github.com/koknese/wardrobe
cd wardrobe
```
### 2. Install dependencies
For the dependencies I use Bun. Compatibility with other package managers has not been tried.
```sh
bun i
```

### 3. Create an alias
Open your shell configuration file (such as .zshrc or .bashrc) and enter this
```sh
wardrobe='bun run PATH/TO/wardrobe/index.ts'
```

## Usage
For a complete list of commands, run `wardrobe help <command>`.

**Examples:**
Steal EMFORGINE156's avatar and [c]ache it. Prioritize the [C]ache if the user is cached. [s]ave the output to clipboard.
```sh
wardrobe steal -cCs emforgine156
```

Steal the avatar of the user with the [i]d 1194887627 and [c]ache it. Prioritize the [C]ache if the user is cached. [s]ave the output to clipboard.
```sh
wardrobe steal -cCsi emforgine156
```

Update the cache with the current avatars of players.
```sh
wardrobe update-cache
```
