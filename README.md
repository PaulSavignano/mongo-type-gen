<h1 align="center">mongo-type-gen</h1>

<div align="center" dir="auto">
	<img 
		alt="release"
		src="https://github.com/PaulSavignano/mongo-type-gen/actions/workflows/release.yaml/badge.svg"
	/>
</div>

## Table of Contents

- [Motivation](#motivation)
- [Usage](#usage)
- [Config](#config)

## Motivation

Working with typescript can involve some busy work in creating all the different types associated with your data. From GraphQL SDLs, to Typescript types, to Mongo JSON schemas. Let's dry this up and only define our types once. Let mongo-type-gen handle the busy work of producing the different types needed Tools like graphql codegen can help by generating typescript types from your GraphQL SDLs but do not help with Mongo Schema validation. Your either stuck reproducing the validators (types) in another file or looking to app level data validation through Mongoose. Either way, you drowning in writing wet types.

Let's dry off. So, why use Mongo's json schema over GraphQL or Typescirpt. One simple answer, we want our source to be the most expressive source. Mongo's validators allow us to not only define types, but also valiation rules, descriptions, deprecations. Simply put, the Mongo JSON schema validation is the most rich way we to express our data.

This project handles the following busy work for you;

- **Simple:** Short `mtg` command allows for easy generating, uploading, and downloading of types.
- **Performant:** Lightweight, with very few deps and a small bundle size.

## Usage

Add run scripts to package.json

```json
{
  "scripts": {
    "gen-types": "mtg",
    "downlaod-validators": "mtg-download-validators",
    "upload-validators": "mtg-upload-validators",
    "start": "ts-node-dev ./src/index.ts & npm run mtg"
  }
}
```

With mongo-type-gen, you'll need Mongo JSONSchema flavor validators. You can either define these in the project and ref them in the `mtg.config.js` config file or have `mtg` download them from mongo with `mtg-download-validators`.

To see this in action, let's create a `mtg.config.js` config file.

```js
module.exports = {
  db: 'mongo-type-gen',
  input: '**/*.validator.*s',
  output: 'src',
  uri: 'mongodb://localhost:27017',
};
```

This let's `mtg` learn where it should download or upload your validators. These validators are used to generate Typescript types and GraphQL SDLs.

We also have a watcher in play so any changes you make to your validators files will be reflected in your types.

Define something like the following for your start script.

```json
"start": "ts-node-dev ./src/index.ts & mtg",
```
