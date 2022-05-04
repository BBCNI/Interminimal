import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, ComponentType, FunctionComponent, useState } from "react";
import {
  T,
  tBind,
  tBindMulti,
  TDictType,
  Translate,
  useTranslation
} from "../lib/interminimal";
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
const dictionary = {
  site: { en: "Interminimal" },
  // Numbers
  one: {
    en: "One (%{site})",
    fr: "Un (%{site})",
    de: "Ein (%{site})",
    cy: "Un (%{site})"
  },
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

const Info: ComponentType<{}> = () => {
  // const ctx = useTranslation();
  // console.log(ctx.stack);
  return null;
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

  // Bake an alternative to <T as="li" ...>
  const [Tli, Toption, Tdiv, Th2, Tp] = tBindMulti([
    "li",
    "option",
    "div",
    "h2",
    "p"
  ]);

  // Unfortunately we have to cast next/Image as a FunctionComponent.
  // Not sure what a better fix for this might be.
  const TImage = tBind(Image as FunctionComponent);

  return (
    <div>
      <Translate lang={curLang}>
        <Info />
        <select value={curLang} onChange={onChange}>
          {langs.map(lang => (
            <Toption key={lang} value={lang} tag={lang} />
          ))}
        </select>

        <Th2 text="Phrases" />
        <ul>
          <Tli text="Always English" />
          <Tli text={greeting} />
          <Tli text={message} />
          {/* alternative tag spec */}
          <Tli text={["one"]} />
          {/* regular tag spec */}
          <Tli tag="two" />
          {/* inline fat string */}
          <Tli
            text={{ en: "Where is the spinach?", fr: "Où sont les épinards?" }}
          />
        </ul>

        <Th2 text="Languages" />
        <ul>
          {langs.map(lang => (
            <Tli key={lang} tag={lang} />
          ))}
        </ul>

        <Th2 text="Info" />
        {/* `info` has two placeholders which we fill with "one" and "two" */}
        <Tp text={info}>
          <T tag="one" />
          <T tag="two" />
        </Tp>

        <Th2 text="Cats" />
        <figure className={styles.cat}>
          {/* translate alt attribute via cat tag */}
          <TImage
            altText={["cat"]}
            width="500"
            height="300"
            src="http://placekitten.com/g/500/300"
          />
        </figure>

        {/* many cats, many plurals */}
        {counts.map((n, i) => (
          <Tdiv key={i} tag="cats" count={n}>
            {String(n)}
          </Tdiv>
        ))}
      </Translate>
    </div>
  );
};

const Home: NextPage<PageProps> = props => {
  return (
    <Translate dictionary={dictionary}>
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
