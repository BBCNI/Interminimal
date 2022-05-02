import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, ComponentType, useState } from "react";
import { T, Translate, TString } from "../lib/interminimal";
import styles from "../styles/Home.module.css";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      name: { en: "Hello", fr: "Bonjour" }
    }
  };
}

const translation = {
  two: { en: "Two", fr: "Deux", de: "Zwei" },
  en: { en: "English", fr: "Anglais" },
  fr: { en: "French", fr: "Francais" },
  de: { en: "German", fr: "Allemand", de: "Deutsch" }
};

const Block: ComponentType<{ name: any; lang: string }> = ({ name, lang }) => {
  const [curLang, setLang] = useState(lang);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setLang(e.target.value);
  };

  return (
    <div>
      <Translate lang={curLang}>
        <ul>
          <T as="li">Hello</T>
          <T as="li">{name}</T>
          <T as="li" tag="two" />
        </ul>
        <select value={curLang} onChange={onChange}>
          <option value="en">
            <T tag="en" />
          </option>
          <option value="fr">
            <T tag="fr" />
          </option>
          <option value="de">
            <T tag="de" />
          </option>
        </select>
      </Translate>
    </div>
  );
};

const Home: NextPage<{ name: any }> = props => {
  console.log(props);
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
          <Block name={props.name} lang="en" />
          <Block name={props.name} lang="fr" />
          <Block name={props.name} lang="de" />
        </main>
      </div>
    </Translate>
  );
};

export default Home;
