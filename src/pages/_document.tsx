import Document, {
    Html,
    Main,
    NextScript,
    Head,
    DocumentContext,
} from 'next/document';
import React from 'react';
// import auth from 'basic-auth';

/**
 * We've replaced basic-auth with next-auth.
 */
// declare let process: any;

// function verifyCredentials(username: string, password: string) {
//     return !!(
//         username === process.env.BASIC_AUTH_USER &&
//         password === process.env.BASIC_AUTH_PASS
//     );
// }

/**
 * Overrides the NextJS Document component which is only run server-side.
 * We override the `getInitialProps` function and implement the parsing of all
 * our BASIC AUTH.
 */
export default class MyDocument extends Document<any> {
    static async getInitialProps(ctx: DocumentContext) {
        /**
         * We've replaced basic-auth with next-auth.
         */
        // if (ctx.req) {
        //     const user = auth(ctx.req); // => { name: 'something', pass: 'whatever' }

        //     // Basic auth credential checking.
        //     if (!user || !verifyCredentials(user.name, user.pass)) {
        //         ctx.res.statusCode = 401;
        //         ctx.res.setHeader(
        //             'WWW-Authenticate',
        //             'Basic realm="FDMG Tag Manager"'
        //         );
        //         ctx?.res?.end?.('Access denied');
        //     }
        // }

        const initialProps: any = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: <>{initialProps.styles}</>,
        };
    }

    render() {
        return (
            <Html lang="nl">
                <Head>
                    <meta
                        httpEquiv="Content-Type"
                        content="text/html; charset=UTF-8"
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `try {
    var query = window.matchMedia("(prefers-color-scheme: dark)");
    var preference = window.localStorage.getItem("theme");
    if (preference) {
        if ((preference === "system" && query.matches) || preference === "dark") {
            document.documentElement.style.backgroundColor = "#191919";
        } else {
            document.documentElement.style.backgroundColor = "#FFEADB";
        }
    } else {
        document.querySelector('html').classList.add('light');
    }
} catch (e) {}`,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
