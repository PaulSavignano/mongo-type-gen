<h1 align="center">mongo-type-gen</h1>

<div align="center" dir="auto">

Define types once, reuse them everywhere!

[![release](https://github.com/PaulSavignano/mongo-type-gen/actions/workflows/release.yaml/badge.svg)](https://github.com/PaulSavignano/mongo-type-gen/actions/workflows/release.yaml)
[![NPM Version](https://img.shields.io/npm/v/mongo-type-gen.svg?style=flat)](https://www.npmjs.com/package/mongo-type-gen)
[![NPM Downloads](https://img.shields.io/npm/dm/mongo-type-gen.svg?style=flat)](https://npmcharts.com/compare/mongo-type-gen?minimal=true)
[![BundleSize](https://img.shields.io/bundlephobia/minzip/mongo-type-gen.svg)](https://bundlephobia.com/result?p=mongo-type-gen)
[![Patreon](https://img.shields.io/badge/patreon-support%20the%20author-blue.svg)](https://www.patreon.com/PaulSavignano)

</div>

`mongo-type-gen` is a lib for unifing your types. Define once, reuse everywhere!

- **Simple:** Short `mtg` command allows for easy generating, uploading, and downloading of types.
- **Performant:** Lightweight, with very few deps and a small bundle size.

## Table of Contents

- [Motivation](#motivation)
- [Usage](#usage)
- [Config](#config)
- [Validators](#validators)

## Motivation

Working with typescript can involve some busy work in creating all the different types associated with your data. From GraphQL SDLs, to Typescript types, to Mongo JSON schemas or Mongoose.

Let's dry this up and only define our types once. Let mongo-type-gen handle the busy work of producing the different types needed for your GraphQL app writen in Typescript.

First, let's identify the best source for types. What syntax allows us to be the most expressive 🤔. That's where Mongo's `$jsonSchema`` validators come into play. They allow for expression of meta data that cannot be expressed in Typescript, GraphQL, or Mongoose alone. This lib uses validators as the source.

Whether you have your validators defined in your project or they live in MongoDB, we'll grab em' and generate your types and SDLs.

## Usage

To get started, add the lib to your project. You'll only need it for local dev so install it as a dev dep.

```bash
npm i -D mongo-type-gen
```

Then create some ease-of-use scripts in your package.json.

```json
{
  "scripts": {
    "gen-types": "mtg", // Root command, generate typescript and sdls from your **.validators.ts files
    "downlaod-validators": "mtg-download-validators", // Utility fn to grag your validators from Mongo
    "upload-validators": "mtg-upload-validators", // Utility fn to upload your local validators to Mongo
    "start": "ts-node-dev ./src/index.ts & npm run mtg" // Example start scripts
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

This let's `mtg` learn where it should download or upload your validators. These validators are used to generate your data's Typescript types and GraphQL SDLs.

We also have a watcher in play so any changes you make to your validators files will be reflected in your types.

Define something like the following for your start script.

## Validators

Curious about validators? Check out Mongo's docs. Validators are awesome!
https://www.mongodb.com/docs/upcoming/core/schema-validation/#schema-validation
