import React, { useState } from 'react';
import { Tag, TagComponent } from '../components/tag/Tag';
import getRawBody from 'raw-body';
import { store } from './api/store';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { TextInput } from '@fdmg/design-system/components/input/TextInput';
import styles from './index.module.scss';
import { signIn, signOut, useSession } from 'next-auth/client';
import { Button } from '@fdmg/design-system/components/button/Button';

interface Props {
    requiresLogin: boolean;
    tags: Tag[];
}

async function getTags() {
    let tags: Tag[] = [];
    try {
        const storeTags = await fetch(
            `https://s3.eu-west-1.amazonaws.com/${process.env.PROD_BUCKET}/${process.env.S3_LOCATION}tags.json`
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
    }

    function handleTestUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTestUrl(e.currentTarget.value);
    }

    function urlMatcher(testUrl: string, regExp: string) {
        return new RegExp(regExp, 'gi').test(testUrl);
    }

    return (
        <>
            {props.requiresLogin && loading && (
                <section className={styles.login} />
            )}
            {props.requiresLogin && !session && !loading && (
                <section className={styles.login}>
                    <h1>FDMG Tag Manager</h1>
                    <Button onClick={() => signIn()}>Sign in</Button>
                </section>
            )}
            {(session || !props.requiresLogin) && (
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
                        key={uuidv4()}
                        uuid={uuidv4()}
                        onSubmit={onSubmit}
                        urlMatcher={urlMatcher}
                        testUrl={testUrl}
                    />
                </section>
            )}
        </>
    );
}

export async function getServerSideProps({ req }) {
    const tags = await getTags();

    if (req.method == 'POST') {
        const body = await getRawBody(req);
        const formData = new URLSearchParams(body.toString('utf-8'));
        await store(getUpdatedTags(tags, formData));
    }

    return {
        props: {
            tags,
            requiresLogin:
                process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS,
        },
    };
}

export default Page;
