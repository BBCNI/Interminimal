import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { useEffect } from "react";
import { Children } from "react";

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
  TFatString,
  TString
} from "../dist/esm";
import { parseAcceptLanguage } from "../dist/esm/accept";

import styles from "../styles/Home.module.css";

interface PageProps {
  greeting: TFatString;
  message: TFatString;
  info: TFatString;
  nested: TFatString;
}

// Mock service data
export const getStaticProps: GetStaticProps = async context => {
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
        "en": "Here's a %1[useful link] and here's some %2[italic text]",
        "en-GB":
          "Would you care for a %1[useful link]? Or maybe some %2[italic text]?",
        "fr": "Voici %2[du texte en italique] et un %1[lien utile]",
        "de": "Hier ist ein %1[nützlicher Link] und hier ein %2[kursiver Text]"
      }
    }
  };
};

// Translation dictionary
const dictionary: TDictionaryRoot = {
  $$dict: {
    "site": {
      "*": "Interminimal",
      "en": "Interminimal",
      "fr": "Chose internationale"
    },
    // Numbers
    "one": {
      en: "One",
      fr: "Un",
      de: "Ein",
      cy: "Un"
    },
    "two": { en: "Two", fr: "Deux", de: "Zwei", cy: "Dau" },
    "three": { en: "Three" },
    // Language names
    "en": { en: "English", fr: "Anglais" },
    "en-GB": { "en-GB": "British" },
    "fr": { fr: "Français" },
    "de": { en: "German", fr: "Allemand", de: "Deutsch" },
    "cy": { en: "Welsh", cy: "Cymraeg" },
    "cat": {
      en: "cat",
      de: "Katze",
      cy: "cath"
    },
    "colour": {
      "en-GB": "colour",
      "en": "color"
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
    "madness": {
      $$dict: {
        site: { en: "Or maybe something else", fr: "Ou peut-être autre chose" }
      }
    },
    "h.siteName": { en: "It's Called", fr: "C'est Appelé" },
    "h.someCats": { en: "Some Cats", fr: "Quelques Chats", cy: "Rhai Cathod" }
  }
};

// Demo how to use Intl with Interminimal
const DateFormat: ComponentType<
  { date: Date } & Intl.DateTimeFormatOptions
> = ({ date, ...opt }) => {
  const ctx = useTranslation();
  // Use our languages stack to find a format for our locale
  const dtf = new Intl.DateTimeFormat(ctx.languages, opt);
  // Find out which language was matched...
  const { locale } = dtf.resolvedOptions();
  // Format the date and create a literal ts with the available
  // locale
  const ts = TString.literal(dtf.format(date), locale);
  // Format it using T
  return <T text={ts} />;
};

const TList: ComponentType<{
  children: ReactNode;
  type?: "conjunction" | "disjunction";
  style?: "long" | "short" | "narrow";
}> = ({ children, ...opt }) => {
  const ctx = useTranslation();
  // @ts-ignore - no type mapping available
  const lf = new Intl.ListFormat(ctx.languages, opt);
  const { locale } = lf.resolvedOptions();
  // Make the children into a list of args, %1, %2 etc
  const list = Array.from(
    { length: Children.count(children) },
    (_v, i) => `%${i + 1}`
  );
  // Format the list into a template string and make the translated
  // template and locale into a TString
  const ts = TString.literal(lf.format(list), locale);
  // Format it using T
  return <T text={ts}>{children}</T>;
};

const Clock: ComponentType<Intl.DateTimeFormatOptions> = ({ ...opt }) => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = setInterval(update, 500);
    update();
    return () => clearInterval(timer);
  }, []);
  if (!now) return null;
  return <DateFormat date={now} {...opt} />;
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

interface LanguageState {
  lang: string;
  setLang: (lang: string) => void;
  label: string;
}

const useLanguageState = (
  defaultLang: string,
  label: string
): LanguageState => {
  const [lang, setLang] = useState(defaultLang);
  return { lang, setLang, label };
};

const useLanguageStates = (
  lang1: string,
  lang2: string,
  lang3: string
): LanguageState[] => {
  return [
    useLanguageState(lang1, "one"),
    useLanguageState(lang2, "two"),
    useLanguageState(lang3, "three")
  ];
};

const langs = ["en-GB", "en", "fr", "de", "cy"];

const LanguagePicker: ComponentType<{
  label: TextPropType;
  state: LanguageState;
}> = ({ label, state }) => {
  // Bake an alternative to <T as="li" ...>
  const [Toption] = tBindMulti(["option"]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    state.setLang(e.target.value);
  };

  return (
    <label>
      <T text={label} />
      {": "}
      <select value={state.lang} onChange={onChange}>
        {langs.map(lang => (
          <Toption key={lang} value={lang} tag={lang} />
        ))}
      </select>
    </label>
  );
};

const Stack: ComponentType = () => {
  const ctx = useTranslation();
  return (
    <p>
      <TList>
        {ctx.languages.map(lang =>
          ctx.hasTag(lang) ? (
            <T key={lang} tag={lang} />
          ) : (
            <T key={lang} text={lang} />
          )
        )}
      </TList>
    </p>
  );
};

const loader = ({ src, width }: { src: string; width: number }) =>
  `${src}/${width}/${Math.round((width * 9) / 16)}`;

const Block: ComponentType<
  PageProps & { lang: string; state: LanguageState[] }
> = ({ greeting, message, info, nested, state }) => {
  const counts = [0, 1, 1.5, 2, 3, 6, 42];

  // Bake an alternative to <T as="li" ...>
  const [Tli, Tdiv, Th2, Tp] = tBindMulti(["li", "div", "h2", "p"]);

  // Unfortunately we have to cast next/Image as a FunctionComponent.
  // Not sure what a better fix for this might be.
  const TImage = tBind(Image as FunctionComponent);
  const TBox = tBind(Box as FunctionComponent);

  return (
    <div>
      <Translate lang={state.map(s => s.lang)}>
        {state.map(s => (
          <Fragment key={s.label}>
            <LanguagePicker label={[s.label]} state={s} />{" "}
          </Fragment>
        ))}
        <Th2 text="Languages" />
        <Stack />
        <Th2 text="Time" />
        <div className={styles.clock}>
          <Clock dateStyle="full" timeStyle="full" />
        </div>
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
        <Th2 text="Info" />
        {/* `info` has two placeholders which we fill with "one" and "two" */}
        <Tp text={info}>
          <T tag="one" />
          <T tag="two" />
        </Tp>
        <Tp tag="colour" />
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
            width="512"
            height="288"
            loader={loader}
            src="http://placekitten.com/g"
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
  const state1 = useLanguageStates("de", "en", "fr");
  const state2 = useLanguageStates("en", "en", "en");
  const state3 = useLanguageStates("fr", "en", "en");

  return (
    <Translate dictionary={dictionary}>
      <div className={styles.container}>
        <Head>
          <meta name="description" content="Minimal i18n" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <TTitle text={["site"]} />

        <main className={styles.main}>
          <h1 className={styles.title}>Interminimal</h1>
          <ul className={styles.links}>
            <li>
              <Link href="https://github.com/BBCNI/Interminimal">
                <a>GitHub</a>
              </Link>
            </li>
            <li>
              <Link href="https://www.npmjs.com/package/interminimal">
                <a>NPM</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>API Documentation</a>
              </Link>
            </li>
            <li>
              <Link href="https://github.com/BBCNI/Interminimal/blob/main/demo/pages/index.tsx">
                <a>Demo Source</a>
              </Link>
            </li>
          </ul>

          <div className={styles.blocks}>
            <Block {...props} state={state1} lang="de" />
            <Block {...props} state={state2} lang="en" />
            <Block {...props} state={state3} lang="fr" />
          </div>
        </main>
      </div>
    </Translate>
  );
};

export default Home;
