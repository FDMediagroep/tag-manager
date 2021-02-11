import React from 'react';
import { csrfToken } from 'next-auth/client';
import { TextInput } from '@fdmg/design-system/components/input/TextInput';
import { Button } from '@fdmg/design-system/components/button/Button';
import styles from './signin.module.scss';

function SignIn({ csrfToken }) {
    return (
        <section className={styles.signin}>
            <form method="post" action="/api/auth/callback/credentials">
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
