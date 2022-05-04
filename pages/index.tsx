import type { NextPage } from "next";
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
export async function getServerSideProps() {
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
        // Demo substitution
        en: 'The word for 1 is "%1" and the word for 2 is "%2"',
        fr: 'Le mot pour 2 est "%2" et le mot pour 1 est "%1".'
      }
    }
  };
}

// Translation dictionary
const translation = {
  // Numbers
  one: { en: "One", fr: "Un", de: "Ein", cy: "Un" },
  two: { en: "Two", fr: "Deux", de: "Zwei", cy: "Dwy" },
  // Language names
  en: { en: "English", fr: "Anglais" },
  fr: { fr: "Français" },
  de: { en: "German", fr: "Allemand", de: "Deutsch" },
  cy: { en: "Welsh", cy: "Cymraeg" },
  cat: {
    en: "cat",
    de: "Katze",
    cy: "gath"
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
  const counts = [0, 1, 1.5, 2, 3, 6, 42];

  return (
    <div>
      <Translate lang={curLang}>
        <select value={curLang} onChange={onChange}>
          {langs.map(lang => (
            <T as="option" key={lang} value={lang} tag={lang} />
          ))}
        </select>

        <T as="h2" text="Phrases" />
        <ul>
          <T as="li" text="Always English" />
          <T as="li" text={greeting} />
          <T as="li" text={message} />
          {/* alternative tag spec */}
          <T as="li" text={["one"]} />
          {/* regular tag spec */}
          <T as="li" tag="two" />
          {/* inline translation */}
          <T
            as="li"
            text={{ en: "Where is the spinach?", fr: "Où sont les épinards?" }}
          />
        </ul>

        <T as="h2" text="Languages" />
        <ul>
          {langs.map(lang => (
            <T key={lang} as="li" tag={lang} />
          ))}
        </ul>

        <T as="h2" text="Info" />
        {/* `info` has two placeholders which we fill with "one" and "two" */}
        <T as="p" text={info}>
          <T tag="one" />
          <T tag="two" />
        </T>

        <T as="h2" text="Cats" />
        {/* translate alt attribute via cat tag */}
        <T as="img" altText={["cat"]} src="http://placekitten.com/g/200/300" />

        {/* many cats, many plurals */}
        {counts.map((n, i) => (
          <T as="div" key={i} tag="cats" count={n}>
            {String(n)}
          </T>
        ))}
      </Translate>
    </div>
  );
};

const Home: NextPage<PageProps> = props => {
  return (
    <Translate translation={translation}>
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
            <Block {...props} lang="cy" />
            <Block {...props} lang="en" />
            <Block {...props} lang="fr" />
          </div>
        </main>
      </div>
    </Translate>
  );
};

export default Home;
