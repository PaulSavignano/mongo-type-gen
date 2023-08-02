<h1 align="center">mongo-type-gen</h1>

<div align="center" dir="auto">
	<img 
		alt="main"
		src="https://github.com/PaulSavignano/mongo-type-gen/actions/workflows/pr.yml/badge.svg"
	/>
</div>

## Table of Contents

- [Usage](#usage)

## Usage

Add run scripts to package.json

```json
{
  "scripts": {
    "gen-types": "mtg",
    "gen-validators": "mtg-gen-validators",
    "add-validators": "mtg-add-validators",
    "start": "ts-node-dev ./src/index.ts & npm run mtg"
  }
}
```

```bash
1.  npm run start
```
