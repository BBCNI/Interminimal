import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, ComponentType, useState } from "react";
import { T, TDictType, Translate } from "../lib/interminimal";
import styles from "../styles/Home.module.css";

interface PageProps {
  greeting: TDictType;
  message: TDictType;
  info: TDictType;
}

// Mock service data
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      greeting: { en: "Hello", fr: "Bonjour", de: "Hallo" },
      message: {
        en: "Let's translate text!",
        fr: "Traduisons le texte!",
        de: "Lassen Sie uns Text übersetzen!",
        cy: "Gadewch i ni gyfieithu testun!"
      },
      info: {
        en: 'The word for 1 is "%1" and the word for 2 is "%2"',
        fr: 'Le mot pour 2 est "%2" et le mot pour 1 est "%1".'
      }
    }
  };
}

// Translation dictionary
const translation = {
  one: { en: "One", fr: "Un", de: "Ein", cy: "Un" },
  two: { en: "Two", fr: "Deux", de: "Zwei", cy: "Dwy" },
  en: { en: "English", fr: "Anglais" },
  fr: { fr: "Français" },
  de: { en: "German", fr: "Allemand", de: "Deutsch" },
  cy: { en: "Welsh", cy: "Cymraeg" }
};

const Block: ComponentType<PageProps & { lang: string }> = ({
  greeting,
  message,
  info,
  lang
}) => {
  const [curLang, setLang] = useState(lang);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setLang(e.target.value);
  };

  const langs = ["en", "fr", "de", "cy"];

  return (
    <div>
      <Translate lang={curLang}>
        <select value={curLang} onChange={onChange}>
          {langs.map(lang => (
            <T key={lang} as="option" value={lang} tag={lang} />
          ))}
        </select>
        <h2>Phrases</h2>
        <ul>
          <T as="li" text="Always English" />
          <T as="li" text={greeting} />
          <T as="li" text={message} />
          <T as="li" tag="one" />
          <T as="li" tag="two" />
        </ul>
        <h2>Languages</h2>
        <ul>
          {langs.map(lang => (
            <T key={lang} as="li" tag={lang} />
          ))}
        </ul>
        <h2>Info</h2>
        <T as="p" text={info}>
          {[<T key="1" tag="one" />, <T key="2" tag="two" />]}
        </T>
      </Translate>
    </div>
  );
};

const Format: ComponentType<{ format: string; children: any }> = ({
  format,
  children
}) => {
  const parts = format.split(/%(\d)/);
  console.log(parts);
  const avail = new Set(children.map((_x: any, i: number) => i + 1));
  const out = [];
  while (parts.length) {
    const [frag, arg] = parts.splice(0, 2);
    if (frag.length) out.push(frag);
    if (arg) {
      const idx = Number(arg);
      if (idx < 1 || idx > children.length)
        throw new Error(
          `Arg out of range %${idx} (1..${children.length} are valid)`
        );
      if (!avail.has(idx)) throw new Error(`Already using arg %${idx}`);
      avail.delete(idx);
      const child = children[idx - 1];
      console.log(child);
      out.push(child);
    }
  }

  if (avail.size) throw new Error(`Unused args: ${avail}`);
  return <>{out}</>;
};

const Home: NextPage<PageProps> = props => {
  return (
    <Translate lang="en" translation={translation}>
      <div className={styles.container}>
        <Head>
          <title>Interminimal</title>
          <meta name="description" content="Minimal i18n" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Interminimal</h1>
          <div></div>
          <div className={styles.blocks}>
            <Block {...props} lang="en" />
            <Block {...props} lang="fr" />
            <Block {...props} lang="de" />
          </div>
        </main>
      </div>
    </Translate>
  );
};

export default Home;
