import Link from "next/link";
import { ComponentType } from "react";
import styles from "./Links.module.css";

export const Links: ComponentType = () => {
  return (
    <ul className={styles.links}>
      <li>
        <Link href="/">
          <a>Demo</a>
        </Link>
      </li>
      <li>
        <Link href="/calculator">
          <a>Calculator</a>
        </Link>
      </li>
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
