import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  ComponentType,
  FunctionComponent,
  ReactNode,
  useState
} from "react";
import {
  T,
  tBind,
  tBindMulti,
  TextPropType,
  Translate,
  useTranslation,
  TDictionaryRoot,
  TFatString
} from "../../..";

import styles from "../styles/Home.module.css";

interface PageProps {
  greeting: TFatString;
  message: TFatString;
  info: TFatString;
  nested: TFatString;
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
      },
      nested: {
        en: "Here's a %1[useful link] and here's some %2[italic text]",
        fr: "Voici %2[du texte en italique] et un %1[lien utile]",
        de: "Hier ist ein %1[nützlicher Link] und hier ein %2[kursiver Text]"
      }
    }
  };
}

// Translation dictionary
const dictionary: TDictionaryRoot = {
  $$dict: {
    "site": { en: "Interminimal" },
    // Numbers
    "one": {
      en: "One",
      fr: "Un",
      de: "Ein",
      cy: "Un"
    },
    "two": { en: "Two", fr: "Deux", de: "Zwei", cy: "Dau" },
    // Language names
    "en": { en: "English", fr: "Anglais" },
    "fr": { fr: "Français" },
    "de": { en: "German", fr: "Allemand", de: "Deutsch" },
    "cy": { en: "Welsh", cy: "Cymraeg" },
    "cat": {
      en: "cat",
      de: "Katze",
      cy: "cath"
    },
    // Plurals
    "cats": {
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
    },
    // Silly deep nesting.
    "silly": {
      en:
        "Top level %1[Level one %1[Level two] and " +
        "%2[also level two with %1[level three]]]",
      fr:
        "Niveau supérieur %1[Niveau un %1[Niveau deux]" +
        " et %2[aussi niveau deux avec %1[niveau trois]]]",
      de:
        "Oberste Ebene %1[Ebene eins %1[Ebene zwei] " +
        "und %2[auch Ebene zwei mit %1[Ebene drei]]]",
      cy:
        "Lefel uchaf %1[Lefel un %1[Lefel dau] a " +
        "%2[hefyd lefel dau gyda %1[lefel tri]]]"
    },
    // A nested dictionary for use with dictionaryFromTag
    "madness": { $$dict: { site: { en: "Or maybe something else" } } },
    "h.siteName": { en: "It's Called", fr: "C'est Appelé" },
    "h.someCats": { en: "Some Cats", fr: "Quelques Chats", cy: "Rhai Cathod" }
  }
};

const Box: ComponentType<{ children: ReactNode; lang?: string }> = ({
  children
}) => <>[{children}]</>;

interface TTitleProps {
  text: TextPropType;
  lang?: string;
}

// Inject page title into a NextJS <Head> component. We have to do the
// translation explicitly because we can't nest a T inside a Head
// Use this component *outside* of any other <Head></Head>
const TTitle: ComponentType<TTitleProps> = ({ text, ...rest }) => {
  const { str, props } = useTranslation().translateTextAndProps(text, rest);
  return (
    <Head>
      <title {...props}>{str}</title>
    </Head>
  );
};

export const Block: ComponentType<PageProps & { lang: string }> = ({
  greeting,
  message,
  info,
  nested,
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
  const TBox = tBind(Box as FunctionComponent);

  return (
    <div>
      <Translate lang={curLang}>
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
          {/* inline fat string */}
          <Tli
            text={{
              en: "Where is the spinach? (%{site})",
              fr: "Où sont les épinards? (%{site})"
            }}
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

        <Tp content={info} />

        <Tp text={nested}>
          <Link href="/" passHref={true}>
            <T as="a" tag="%1" />
          </Link>
          <T as="i" tag="%2" />
        </Tp>

        <Tp tag="silly">
          <TBox tag="%1">
            <TBox tag="%1" />
            <TBox tag="%2">
              <TBox tag="%1" />
            </TBox>
          </TBox>
        </Tp>

        <Th2 tag="h.someCats" />
        <figure className={styles.cat}>
          {/* translate alt attribute via cat tag */}
          <TImage
            t-alt={["cat"]}
            width="500"
            height="200"
            src="http://placekitten.com/g/500/200"
          />
        </figure>

        {/* many cats, many plurals */}
        {counts.map((n, i) => (
          <Tdiv key={i} tag="cats" count={n}>
            {String(n)}
          </Tdiv>
        ))}

        <Th2 tag="h.siteName" />
        <T tag="site" />
        <Translate dictionaryFromTag="madness">
          <T tag="site" />
        </Translate>
      </Translate>
    </div>
  );
};

const Home: NextPage<PageProps> = props => {
  return (
    <Translate dictionary={dictionary}>
      <div className={styles.container}>
        <Head>
          {/* <title>Interminimal</title> */}
          <meta name="description" content="Minimal i18n" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <TTitle text={["site"]} />

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
