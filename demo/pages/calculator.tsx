import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { ComponentType } from "react";
import { LangContext } from "../dist/cjs";
import {
  canonicaliseLanguage,
  parseAcceptLanguage,
  canonicaliseLocales,
  LocaleStack,
  searchOrder,
  useTranslation,
  TString,
  T,
  Translate
} from "../dist/esm";
// import { searchOrder } from "../dist/esm/searchOrder";

import { Links } from "../lib/links";

import styles from "../styles/Calculator.module.css";

const canonicalise = (lang: string) => {
  const c = canonicaliseLanguage(lang);
  return c ? [c] : [];
};

const parseLangs = (inp: string) => inp.split(/\s+/).flatMap(canonicalise);

function parseInput(inp: string): { stack: LocaleStack; type: string } {
  return /^\s*$/.test(inp)
    ? { stack: [], type: "is-empty" }
    : /[;,]/.test(inp)
    ? { stack: parseAcceptLanguage(inp), type: "is-accept" }
    : { stack: canonicaliseLocales(parseLangs(inp)), type: "is-stack" };
}

const stackCache = new WeakMap<LocaleStack, string>();

const randInt = (min: number, max: number): number =>
  Math.floor(min + Math.random() * (max - min));

const randomColour = () =>
  `hsl(${randInt(0, 360)}deg, ${randInt(80, 100)}%, ${randInt(65, 80)}%)`;

const stackColour = (stack: LocaleStack): string => {
  let colour = stackCache.get(stack);
  if (!colour) stackCache.set(stack, (colour = randomColour()));
  return colour;
};

// Which APIs?

const API = [
  "Collator",
  "DateTimeFormat",
  "ListFormat",
  "NumberFormat",
  "PluralRules",
  "RelativeTimeFormat",
  "Segmenter"
];

interface Judgement {
  state: "fail" | "exact" | "miss" | "match";
  reason: string;
  locale?: string;
}

const bail = (reason: string): Judgement => ({ state: "fail", reason });

const js = (x: any) => JSON.stringify(x, null, 2);

const tryApi = (langs: LocaleStack, api: string) => {
  const impl = (Intl as { [key: string]: any })[api];
  if (!impl) return bail(`Intl.${api} is not implemented`);
  const intl = new impl(langs);
  if (typeof intl.resolvedOptions !== "function")
    return bail(`Intl.${api} does not implement resolvedOptions()`);
  const opt = intl.resolvedOptions();
  if (!opt || typeof opt !== "object")
    return bail(`Intl.${api}.resolvedOptions() doesn't return an object`);
  const { locale } = opt;
  if (!locale)
    return bail(`Intl.${api}.resolvedOptions() doesn't return a locale`);
  if (locale === langs[0])
    return {
      state: "exact",
      reason: `matched as ${js(locale)}`
    };
  const state = langs.includes(locale) ? "match" : "miss";
  return { state, locale, reason: `resolved as ${js(locale)}` };
};

const APIStatus: ComponentType<{ search: LocaleStack }> = ({ search }) => {
  const verdict = useMemo(
    () => API.map(api => ({ api, status: tryApi(search, api) })),
    [search]
  );

  return (
    <div className={styles.api}>
      <h2>API Support</h2>
      <p>
        Here&apos;s how the Intl APIs resolve <code>{js(search)}</code>
      </p>
      <table>
        <tbody>
          {verdict.map(({ api, status }) => (
            <tr key={api} className={styles[status.state]}>
              <td>Intl.{api}</td>
              <td>{status.state}</td>
              <td>({status.reason})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DateFormat: ComponentType<{ date: Date }> = ({ date }) => {
  const ctx = useTranslation();
  const { dtf, locale } = useMemo(() => {
    const dtf = new Intl.DateTimeFormat(ctx.search, {
      dateStyle: "full",
      timeStyle: "full"
    });
    const { locale } = dtf.resolvedOptions();
    return { dtf, locale };
  }, [ctx.search]);
  const ts = TString.literal(dtf.format(date), locale);
  return <T text={ts} />;
};

const Clock: ComponentType = () => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 500);
    return () => clearInterval(timer);
  }, []);
  return <DateFormat date={now || new Date()} />;
};

const Stack: ComponentType<{ stack: LocaleStack; title: string }> = ({
  stack,
  title
}) => {
  const color = stackColour(stack);
  return (
    <div className={styles.stack}>
      <h2 style={{ color }}>{title}</h2>
      <ul style={{ color }}>
        {stack.length ? stack.map((lang, i) => <li key={i}>{lang}</li>) : null}
      </ul>
    </div>
  );
};

const tryArray = (str: string): string | undefined => {
  try {
    const obj = JSON.parse(str);
    if (Array.isArray(obj) && obj.every(s => typeof s === "string"))
      return obj.join(" ");
  } catch (e) {}
};

const tryJSON = (str: string) => tryArray(str) || tryArray(`[${str}]`);
const maybeJSON = (str: string) => tryJSON(str.replace(/,\s*$/, "")) || str;

const Calculator: ComponentType<{ init?: string; children?: Function }> = ({
  init = "",
  children
}) => {
  const [inp, setInp] = useState(init);
  const inpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInp(maybeJSON(e.target.value));
  };

  const { type, stack } = useMemo(() => parseInput(inp), [inp]);
  const search = useMemo(() => searchOrder(stack), [stack]);

  return (
    <div className={styles.calculator}>
      <div className={styles.is + " " + styles[type]}>
        <input
          size={100}
          type="text"
          value={inp}
          onChange={inpChange}
          placeholder="Languages or Accept-Language header"
        />
      </div>
      <Translate lang={stack}>
        <Stack stack={stack} title="Canonical" />
        <Stack stack={search} title="Search Path" />
        {children && children(search)}
        <div className={styles.clock}>
          <Clock />
        </div>
      </Translate>
    </div>
  );
};

const CalculatorPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Language Search Calculator</title>
        <meta name="description" content="Minimal i18n" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Language Stack Calculator</h1>
        <Links />
        <Calculator init="en">
          {(search: LocaleStack) => <APIStatus search={search} />}
        </Calculator>
        <Calculator init="en-US;q=0.5, en-GB;q=0.9" />
      </main>
    </div>
  );
};

export default CalculatorPage;
