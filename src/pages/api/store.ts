import zlib from "zlib";
import AWS from "aws-sdk";
import { Tag } from "../../components/tag/Tag";

/**
 * Credentials and distribution id from environment variables
 */
const credentials = {
    accessKeyId: process.env.PROD_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.PROD_AWS_SECRET_ACCESS_KEY,
};
let distributionId = process.env.PROD_CDN_DISTRIBUTION_ID;

/**
 * Create S3 instance.
 */
const s3 = new AWS.S3({
    region: process.env.PROD_AWS_DEFAULT_REGION,
    credentials,
});

/**
 * Create CloudFront instance.
 */
const cloudfront = new AWS.CloudFront({
    region: process.env.PROD_AWS_DEFAULT_REGION,
    credentials,
});

async function invalidateCloudFront() {
    try {
        return await cloudfront
            .createInvalidation({
                DistributionId: distributionId,
                InvalidationBatch: {
                    CallerReference: `FDMG-TAG-MANAGER-S3-INVALIDATE-${new Date().getTime()}`,
                    Paths: {
                        Quantity: 1,
                        Items: [`/${process.env.S3_LOCATION}*`],
                    },
                },
            })
            .promise()
            .then(console.log);
    } catch (e) {
        console.error(e);
    }
}

function getJsArray(tags: Tag[]) {
    let hasPreview = false;

    const jsArray = tags.map((tag) => {
        /**
         * Don't add tag JS when it's disabled.
         */
        if (tag.state === "disabled") {
            return null;
        }
        let js = tag.tag;
        /**
         * Encapsulate preview tag with check for query parameter.
         */
        if (tag.state === "preview") {
            hasPreview = true;
            js = `if (__ftm_prev) {${js}}`;
        }
        /**
         * Encapsulate tag with URL match check.
         */
        if (tag.match) {
            js = `if (window.location.href.match(/${
                new RegExp(tag.match).source
            }/gi)) {${js}}`;
        }
        /**
         * Add tag description as code doc.
         */
        const description = tag?.description
            ? `/** ${tag?.description?.replace("/", "%2F")} */\n`
            : "";
        return `${description}try { ${js} } catch(e) { console.error(e); }`;
    });

    /**
     * Contains tags with preview-mode.
     * Then we add functionality for checking if preview-mode has been activated.
     */
    if (hasPreview) {
        jsArray.unshift(
            `const __ftm_prev = window.location.search.indexOf('preview=1') !== -1;`
        );
    }

    return jsArray;
}

export async function store(tags: Tag[]) {
    console.log(
        "Store to",
        `${process.env.PROD_BUCKET}/${process.env.S3_LOCATION}`
    );

    const jsArray = getJsArray(tags);

    const compressedJson = zlib.gzipSync(JSON.stringify(tags, null, 2));
    const compressedJS = zlib.gzipSync(jsArray.join("\n"));

    await s3
        .upload({
            Bucket: process.env.PROD_BUCKET,
            Body: compressedJson,
            Key: `${process.env.S3_LOCATION}tags.json`,
            ContentType: "application/json",
            ContentEncoding: "gzip",
            ACL: "public-read",
        })
        .promise()
        .then(async (uploadResult) => {
            console.log(uploadResult);
        }, console.error);

    await s3
        .upload({
            Bucket: process.env.PROD_BUCKET,
            Body: compressedJS,
            Key: `${process.env.S3_LOCATION}tags.js`,
            ContentType: "application/javascript",
            ContentEncoding: "gzip",
            ACL: "public-read",
        })
        .promise()
        .then(async (uploadResult) => {
            console.log(uploadResult);
        }, console.error);

    await invalidateCloudFront();
}

async function handler(req, res) {
    res.end("OK");
}

export default handler;
