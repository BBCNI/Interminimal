import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, ComponentType, useState } from "react";
import { T, TDictType, Translate } from "../lib/interminimal";
import styles from "../styles/Home.module.css";

interface PageProps {
  greeting: TDictType;
  message: TDictType;
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
        we: "Gadewch i ni gyfieithu testun!"
      }
    }
  };
}

// Translation dictionary
const translation = {
  two: { en: "Two", fr: "Deux", de: "Zwei" },
  en: { en: "English", fr: "Anglais" },
  fr: { fr: "Français" },
  de: { en: "German", fr: "Allemand", de: "Deutsch" },
  we: { en: "Welsh", we: "Cymraeg" }
};

const Block: ComponentType<PageProps & { lang: string }> = ({
  greeting,
  message,
  lang
}) => {
  const [curLang, setLang] = useState(lang);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setLang(e.target.value);
  };

  const langs = ["en", "fr", "de", "we"];

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
          <T as="li">Always English</T>
          <T as="li">{greeting}</T>
          <T as="li">{message}</T>
          <T as="li" tag="two" />
        </ul>
        <h2>Languages</h2>
        <ul>
          {langs.map(lang => (
            <T key={lang} as="li" tag={lang} />
          ))}
        </ul>
      </Translate>
    </div>
  );
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
