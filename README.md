# tag-manager

FDMG Tag Manager is a GUI for managing various JavaScript snippets which are concatenated to a single
`.js` file and uploaded to an S3 bucket.

## States

**Active**: Tag is active and can run when the generated `.js` file is included on the a page.

**Preview**: Tag is in preview and can only run when the URL Query Parameter `?preview=1` exists.

**Disabled**: Tag is disabled and is also omitted from the generated `.js` file.

## URL matching

Each tag can also set it's own URL matching RegExp. This allows for more control over on which url(s) a tag is allowed to run.

## Environment variables

In order to store/load the tags/.js the FDMG Tag Manager requires a few environment variables to be setup:

**PROD_AWS_ACCESS_KEY_ID**: Self-explanatory

**PROD_AWS_DEFAULT_REGION**: Self-explanatory

**PROD_AWS_SECRET_ACCESS_KEY**: Self-explanatory

**PROD_BUCKET**: Self-explanatory

**PROD_CDN_DISTRIBUTION_ID**: Self-explanatory

**BASIC_AUTH_USER**: Basic Auth user and pass are optional. Although recommended when you decide to deploy this to a webserver. For maximum security it is recommended to run this application locally.

**BASIC_AUTH_PASS**: Basic Auth user and pass are optional. Although recommended when you decide to deploy this to a webserver. For maximum security it is recommended to run this application locally.

**S3_LOCATION**: Sub-bucket location within the S3 Bucket

You see a prefix of `PROD_` in front of the AWS environment variable names. This is done in case of when we want to support multiple environments from a single FDMG Tag Manager instance.
