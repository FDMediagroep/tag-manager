import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

async function handler(req, res) {
    return NextAuth(req, res, {
        // Configure one or more authentication providers
        providers: [
            Providers.Credentials({
                // The name to display on the sign in form (e.g. 'Sign in with...')
                name: 'Credentials',
                // The credentials is used to generate a suitable form on the sign in page.
                // You can specify whatever fields you are expecting to be submitted.
                // e.g. domain, username, password, 2FA token, etc.
                credentials: {
                    username: {
                        label: 'Username',
                        type: 'text',
                        placeholder: 'jsmith',
                    },
                    password: { label: 'Password', type: 'password' },
                },
                async authorize(credentials) {
                    // You need to provide your own logic here that takes the credentials
                    // submitted and returns either a object representing a user or value
                    // that is false/null if the credentials are invalid.
                    // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                    if (
                        credentials.username === process.env.BASIC_AUTH_USER &&
                        credentials.password === process.env.BASIC_AUTH_PASS
                    ) {
                        // Any user object returned here will be saved in the JSON Web Token
                        return {};
                    }
                    return null;
                },
            }),
            // ...add more providers here
        ],
        pages: {
            signIn: '/auth/signin',
        },
    });
}

export default handler;
