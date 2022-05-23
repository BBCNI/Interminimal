import Link from "next/link";
import { Fragment } from "react";
import { ComponentType } from "react";
import styles from "./Links.module.css";

const cn = (...cl: string[]) => cl.join(" ");

const MainLinks: ComponentType = () => {
  return (
    <ul>
      <li>
        <Link href="https://github.com/BBCNI/Interminimal/blob/main/demo">
          <a>Demo App Source</a>
        </Link>
      </li>
      <li>
        <Link href="https://bbcni.github.io/Interminimal/">
          <a>API Documentation</a>
        </Link>
      </li>
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
    </ul>
  );
};

const DemoLinks: ComponentType = () => {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Playground</a>
        </Link>
      </li>
      <li>
        <Link href="/calculator">
          <a>Calculator</a>
        </Link>
      </li>
    </ul>
  );
};

export const Links: ComponentType = () => {
  return (
    <Fragment>
      <div className={cn(styles.links, styles.mainLinks)}>
        <MainLinks />
      </div>
      <div className={cn(styles.links, styles.demoLinks)}>
        <DemoLinks />
      </div>
    </Fragment>
  );
};
