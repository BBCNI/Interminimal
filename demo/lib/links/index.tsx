import Link from "next/link";
import styles from "./Links.module.css";

export function Links() {
  return (
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
        <Link href="https://bbcni.github.io/Interminimal/">
          <a>API Documentation</a>
        </Link>
      </li>
      <li>
        <Link href="/">
          <a>Demo</a>
        </Link>
      </li>
      <li>
        <Link href="https://github.com/BBCNI/Interminimal/blob/main/demo/pages/index.tsx">
          <a>Demo Source</a>
        </Link>
      </li>
      <li>
        <Link href="/calculator">
          <a>Calculator</a>
        </Link>
      </li>
    </ul>
  );
}
