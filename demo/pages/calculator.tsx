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

function parseInput(inp: string) {
  return /[;,]/.test(inp)
    ? { stack: parseAcceptLanguage(inp), type: "accept" }
    : { stack: canonicaliseLocales(parseLangs(inp)), type: "stack" };
}

const Stack: ComponentType<{ stack: LocaleStack; title: string }> = ({
  stack,
  title
}) => {
  return (
    <div className={styles.stack}>
      <h2>{title}</h2>
      <ul>
        {stack.map((lang, i) => (
          <li key={i}>{lang}</li>
        ))}
      </ul>
    </div>
  );
};

const Calculator: ComponentType = () => {
  const [inp, setInp] = useState("");
  const inpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInp(e.target.value);
  };

  const { type, stack } = useMemo(() => parseInput(inp), [inp]);
  const search = useMemo(() => searchOrder(stack), [stack]);

  return (
    <div className={styles.calculator}>
      <div>
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
        <h1 className={styles.title}>Language Preference Calculator</h1>
        <Links />
        <Calculator />
      </main>
    </div>
  );
};

export default CalculatorPage;
