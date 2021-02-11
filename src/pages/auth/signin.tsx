import React, { useEffect, useState } from 'react';
import { csrfToken } from 'next-auth/client';
import { TextInput } from '@fdmg/design-system/components/input/TextInput';
import { Button } from '@fdmg/design-system/components/button/Button';
import styles from './signin.module.scss';

function SignIn({ csrfToken }) {
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const errorType = params.get('error');
        if (errorType) {
            setError(errorType);
            if (errorType === 'CredentialsSignin') {
                setError('Credentials incorrect');
            }
        }
    }, []);

    return (
        <section className={styles.signin}>
            <form method="post" action="/api/auth/callback/credentials">
                {error && <p className={styles.error}>{error}</p>}
                <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                />
                <TextInput
                    id="username"
                    name="username"
                    label="username"
                    type="text"
                />
                <TextInput
                    id="password"
                    name="password"
                    label="password"
                    type="password"
                />
                <Button type="submit">Sign in</Button>
            </form>
        </section>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await csrfToken(context),
        },
    };
}

export default SignIn;
