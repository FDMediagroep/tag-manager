import Head from 'next/head';
import React from 'react';

function Page() {
    return (
        <>
            <Head>
                <script
                    src={`https://${process.env.PROD_BUCKET}/${process.env.S3_LOCATION}tags.js`}
                ></script>
            </Head>
            <section>
                <h1>Test page</h1>
                <p>
                    In order to activate "preview" tags. You can add `?preview`
                    to the URL.
                </p>
                <p>
                    <a href="/test?preview=1">Activate preview tags</a>
                </p>
            </section>
        </>
    );
}

export default Page;
