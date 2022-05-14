import type { NextPage } from "next";
import Head from "next/head";

import { T, Translate, TDictionaryRoot, TFatString } from "../dist/esm";

import styles from "../styles/Mule.module.css";

// Translation dictionary
const dictionary: TDictionaryRoot = {
  $$dict: {
    site: {
      "*": "Interminimal",
      "en": "Interminimal",
      "fr": "Chose internationale"
    },
    // Numbers
    one: {
      en: "One",
      fr: "Un",
      de: "Ein",
      cy: "Un"
    },
    two: { en: "Two", fr: "Deux", de: "Zwei", cy: "Dau" },
    three: { en: "Three" },
    // Language names
    en: { en: "English", fr: "Anglais" },
    fr: { fr: "Français" },
    de: { en: "German", fr: "Allemand", de: "Deutsch" },
    cy: { en: "Welsh", cy: "Cymraeg" },
    cat: {
      en: "cat",
      de: "Katze",
      cy: "cath"
    },
    // Plurals
    cats: {
      en: { one: "%1 cat", other: "%1 cats" },
      de: { one: "%1 Katze", other: "%1 Katzen" },
      cy: {
        zero: "%1 cathod",
        one: "%1 gath",
        two: "%1 gath",
        few: "%1 cath",
        many: "%1 chath",
        other: "%1 cath"
      }
    }
  }
};

// Demo how to use Intl with Interminimal

const Mule: NextPage<{}> = () => {
  return (
    <Translate dictionary={dictionary}>
      <Head>
        <title>Mule</title>
        <meta name="description" content="Minimal i18n" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <T tag="site" />
        <Translate lang="fr">
          <T tag="site" />
        </Translate>
      </div>
    </Translate>
  );
};

export default Mule;
