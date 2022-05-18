import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { ComponentType } from "react";
import {
  canonicaliseLanguage,
  parseAcceptLanguage,
  canonicaliseLocales,
  LocaleStack,
  searchOrder
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
  `hsl(${randInt(0, 360)}deg, ${randInt(80, 100)}%, ${randInt(50, 80)}%)`;

const stackColour = (stack: LocaleStack): string => {
  let colour = stackCache.get(stack);
  if (!colour) stackCache.set(stack, (colour = randomColour()));
  return colour;
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

const Calculator: ComponentType<{ init?: string }> = ({ init = "" }) => {
  const [inp, setInp] = useState(init);
  const inpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInp(e.target.value);
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
      <Stack stack={stack} title="Canonical" />
      <Stack stack={search} title="Search Path" />
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
        <Calculator />
        <Calculator init="en-US;q=0.5, en-GB;q=0.9" />
        <Calculator init="en-GB en-US" />
      </main>
    </div>
  );
};

export default CalculatorPage;
