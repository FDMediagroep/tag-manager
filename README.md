![Build](https://github.com/FDMediagroep/tag-manager/workflows/Build/badge.svg)
![CodeQL](https://github.com/FDMediagroep/tag-manager/workflows/CodeQL/badge.svg)

# tag-manager

FDMG Tag Manager is a GUI for managing various JavaScript snippets which are concatenated to a single
`.js` file and uploaded to an S3 bucket.

## Getting started

### Pre-requisites

-   NodeJS

### Install dependencies

1. `npm i` - install dependencies

## Development

1. `npm run dev` - Start the app locally on `localhost:3000`

### Run production build locally

1. `npm run build` - Optimized production build

1. `npm run start` - Start the app locally on `localhost:3000`

## States

**Active**: Tag is active and can run when the generated `.js` file is included on the a page.

**Preview**: Tag is in preview and can only run when the URL Query Parameter `?preview=1` exists.

**Disabled**: Tag is disabled and is also omitted from the generated `.js` file.

## Timing

-   **immediate**: Snippet will be executed as soon as it has been parsed.

-   **DOMContentLoaded**: Snippet will execute when the browser fires this event.

-   **load**: Snippet will execute when the browser fires this event.

-   **readystatechange**: Snippet will execute when the browser fires this event.

-   **beforeunload**: Snippet will execute when the browser fires this event.

-   **unload**: Snippet will execute when the browser fires this event.

## URL matching

Each tag can also set it's own URL matching RegExp. This allows for more control over on which url(s) a tag is allowed to run.

## Environment variables

In order to store/load the tags/.js the FDMG Tag Manager requires a few environment variables to be setup. When running the app locally you can put these environment variables in a `.env` file in the root folder of the project:

**PROD_AWS_ACCESS_KEY_ID**: Self-explanatory

**PROD_AWS_DEFAULT_REGION**: Self-explanatory

**PROD_AWS_SECRET_ACCESS_KEY**: Self-explanatory

**PROD_BUCKET**: Self-explanatory

**PROD_CDN_DISTRIBUTION_ID**: Self-explanatory

**BASIC_AUTH_USER**: For maximum security it is recommended to run this application locally only.

**BASIC_AUTH_PASS**: For maximum security it is recommended to run this application locally only.

**S3_LOCATION**: Sub-bucket location within the S3 Bucket

You see a prefix of `PROD_` in front of the AWS environment variable names. This is done in case of when we want to support multiple environments from a single FDMG Tag Manager instance.
