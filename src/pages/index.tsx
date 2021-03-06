import React, { useState } from 'react';
import { Tag, TagComponent } from '../components/tag/Tag';
import getRawBody from 'raw-body';
import { store } from './api/store';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { TextInput } from '@fdmg/design-system/components/input/TextInput';
import styles from './index.module.scss';
import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { Button } from '@fdmg/design-system/components/button/Button';

interface Props {
    tags: Tag[];
}

async function getTags() {
    let tags: Tag[] = [];
    try {
        const storeTags = await fetch(
            `https://s3.eu-west-1.amazonaws.com/${process.env.PROD_BUCKET}/${process.env.S3_LOCATION}tags.json`,
            { cache: 'no-cache' }
        ).then((res) => res.json());
        tags = storeTags;
    } catch (e) {
        console.error(e);
    }
    return tags;
}

function getUpdatedTags(tags: Tag[], formData: any) {
    let newTags = [...tags];
    const tagExists = newTags.find((tag) => tag.uuid === formData.get('uuid'));
    if (tagExists) {
        newTags = newTags.map((tag) => {
            let newTag: Tag = { tag: null, uuid: null };
            if (tag.uuid === formData.get('uuid')) {
                formData.forEach((val, key) => {
                    newTag[key] = val;
                });
            } else {
                // Keep tag as-is if it's not the one being updated
                newTag = { ...tag };
            }
            return newTag;
        });
    } else {
        const newTag: any = {};
        formData.forEach((val, key) => {
            newTag[key] = val;
        });
        newTags = [...newTags, newTag];
    }
    if (formData.get('remove')) {
        newTags = newTags.filter((tag) => tag.uuid !== formData.get('remove'));
    }
    return newTags;
}

function Page(props: Props) {
    const [session, loading] = useSession();
    const [tags, setTags] = useState(props.tags);
    const [testUrl, setTestUrl] = useState('');
    const [newUuidv4, setNewUuidv4] = useState(uuidv4());

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setTags(getUpdatedTags(await getTags(), formData));
        const urlParams = new URLSearchParams();
        formData.forEach((value, key) => {
            urlParams.append(key, value.toString());
        });
        await fetch(window.location.href, {
            method: 'POST',
            body: urlParams,
        });
        setNewUuidv4(uuidv4());
    }

    function handleTestUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTestUrl(e.currentTarget.value);
    }

    function urlMatcher(testUrl: string, regExp: string) {
        try {
            return new RegExp(regExp, 'gi').test(testUrl);
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    return (
        <>
            {loading && <section className={styles.login} />}
            {!session && !loading && (
                <section className={styles.login}>
                    <h1>FDMG Tag Manager</h1>
                    <Button onClick={() => signIn()}>Sign in</Button>
                </section>
            )}
            {session && (
                <section className={styles.admin}>
                    <h1>
                        FDMG Tag Manager{' '}
                        <Button onClick={() => signOut()}>Sign out</Button>
                    </h1>
                    <p>
                        {`Script: https://${process.env.PROD_BUCKET}/${process.env.S3_LOCATION}tags.js`}
                    </p>
                    <p>
                        <Link href="/test">
                            <a>Test page</a>
                        </Link>
                    </p>
                    <TextInput
                        className={styles.inputFields}
                        id="testURL"
                        type="text"
                        name="test-url"
                        label="Test URL"
                        defaultValue={testUrl}
                        onChange={handleTestUrlChange}
                    />
                    {tags.map((tag) => {
                        return (
                            <TagComponent
                                {...tag}
                                key={tag.uuid}
                                onSubmit={onSubmit}
                                urlMatcher={urlMatcher}
                                testUrl={testUrl}
                            />
                        );
                    })}
                    <TagComponent
                        key={newUuidv4}
                        uuid={newUuidv4}
                        onSubmit={onSubmit}
                        urlMatcher={urlMatcher}
                        testUrl={testUrl}
                    />
                </section>
            )}
        </>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession(context);
    const tags = await getTags();

    if (session && req.method == 'POST') {
        const body = await getRawBody(req);
        const formData = new URLSearchParams(body.toString('utf-8'));
        await store(getUpdatedTags(tags, formData));
    }

    return {
        props: {
            session,
            tags,
        },
    };
}

export default Page;
