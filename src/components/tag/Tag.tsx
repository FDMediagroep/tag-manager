import { v4 as uuidv4 } from "uuid";
import { JSHINT } from "jshint";
import React, { useEffect, useState } from "react";
import styles from "./Tag.module.scss";
import { Button } from "@fdmg/design-system/components/button/Button";
import { ButtonGhost } from "@fdmg/design-system/components/button/ButtonGhost";
import { TextInput } from "@fdmg/design-system/components/input/TextInput";
import { TextArea } from "@fdmg/design-system/components/input/TextArea";
import { Radio } from "@fdmg/design-system/components/input/Radio";

export interface Tag {
    uuid: string;
    state?: "active" | "preview" | "disabled";
    tag: string;
    description?: string;
    match?: string;
}

interface Props {
    description?: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    match?: string;
    state?: "active" | "preview" | "disabled";
    tag?: string;
    uuid?: string;
    [x: string]: any;
}

function TagComponent(props: Props) {
    const [valid, setValid] = useState(false);
    const [opened, setOpened] = useState(false);
    const [remove, setRemove] = useState(false);

    function validSyntax(script: string) {
        let result = false;
        try {
            JSHINT([script]);
            if (!JSHINT.errors.length) {
                result = true;
            } else {
                console.error(JSHINT.errors);
            }
        } catch (e) {
            console.log(e);
        }
        return result;
    }

    function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        try {
            setValid(validSyntax(e.currentTarget.value));
        } catch (e) {
            console.log(e);
            setValid(false);
        }
    }

    function toggleActive() {
        setOpened((opened) => !opened);
    }

    function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
        if (confirm("Remove this tag permanently?")) {
            setRemove(true);
        } else {
            e.preventDefault();
        }
    }

    useEffect(() => {
        setValid(validSyntax(props.tag));
    }, []);

    return (
        <form
            method="POST"
            onSubmit={props.onSubmit}
            className={`${props.className} ${styles.tag}${
                valid ? "" : ` ${styles.error}`
            }${opened ? ` ${styles.opened}` : ""} ${styles[props.state]}`}
        >
            <fieldset>
                <legend>
                    <span onClick={toggleActive}>
                        State [{props.state ?? "new"}]
                        {props.description ? ` - [${props.description}]` : ""}
                        {props.match ? ` - [${props.match}]` : ""}
                    </span>
                </legend>
                <TextInput
                    className={styles.inputField}
                    id={`${props.uuid}`}
                    name="uuid"
                    label="Tag id"
                    readOnly={true}
                    value={props.uuid ?? uuidv4()}
                />
                <section className={styles.states}>
                    <p>Tag state:</p>
                    <Radio
                        id={`${props.uuid}-state-active`}
                        label="Active"
                        name="state"
                        value="active"
                        defaultChecked={props.state === "active"}
                    />
                    <Radio
                        id={`${props.uuid}-state-preview`}
                        label="Preview"
                        name="state"
                        value="preview"
                        defaultChecked={props.state === "preview"}
                    />
                    <Radio
                        id={`${props.uuid}-state-disabled`}
                        label="Disabled"
                        name="state"
                        value="disabled"
                        defaultChecked={
                            !props.state || props.state === "disabled"
                        }
                    />
                </section>
                <TextInput
                    className={styles.inputField}
                    id={`${props.uuid}-description`}
                    name="description"
                    label="Description"
                    value={props.description}
                    required={true}
                />
                <TextArea
                    className={styles.inputField}
                    id={`${props.uuid}-tag`}
                    name="tag"
                    value={props.tag}
                    label="JavaScript"
                    rows={5}
                    spellCheck={false}
                    onChange={onChange}
                    required={true}
                />
                <TextInput
                    className={styles.inputField}
                    id={`${props.uuid}-match`}
                    name="match"
                    label="URL Match (regex)"
                    defaultValue={props.match?.length ? props.match : ".*"}
                />
                <section className={styles.buttons}>
                    <Button>Save</Button>
                    <ButtonGhost onClick={handleDelete}>Remove</ButtonGhost>
                    {remove ? (
                        <input type="hidden" name="remove" value={props.uuid} />
                    ) : null}
                </section>
            </fieldset>
        </form>
    );
}

export { TagComponent };
