import Head from 'next/head';
import React from 'react';
import { Provider } from 'next-auth/client';
import './_app.scss';
import '@fdmg/design-system/components/design-tokens/design-tokens.css';
import '@fdmg/design-system/components/button/Button.css';
import '@fdmg/design-system/components/button/ButtonGhost.css';
import '@fdmg/design-system/components/input/Radio.css';
import '@fdmg/design-system/components/input/TextInput.css';
import '@fdmg/design-system/components/input/TextArea.css';

function PersistentApp({ Component, pageProps }: any) {
    return (
        <>
            <Head>
                <title>FDMG Tag Manager</title>
            </Head>
            <Provider session={pageProps.session}>
                <Component {...pageProps} />
            </Provider>
        </>
    );
}

// Will be called once for every metric that has to be reported.
// export function reportWebVitals(metric) {
//     // These metrics can be sent to any analytics service
//     console.table(metric);
// }

export default PersistentApp;
