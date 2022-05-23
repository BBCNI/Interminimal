import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { ComponentType } from "react";
import styles from "./Links.module.css";

const cn = (...cl: string[]) => cl.join(" ");

interface LinkInfo {
  href: string;
  title: string;
}

const mainLinks: LinkInfo[] = [
  {
    href: "https://github.com/BBCNI/Interminimal/blob/main/demo",
    title: "Demo App Source"
  },
  { href: "https://bbcni.github.io/Interminimal/", title: "Documentation" },
  { href: "https://github.com/BBCNI/Interminimal", title: "GitHub" },
  { href: "https://www.npmjs.com/package/interminimal", title: "NPM" }
];

const demoLinks: LinkInfo[] = [
  { href: "/", title: "Playground" },
  { href: "/calculator", title: "Calculator" }
];

const LinkList: ComponentType<{ links: LinkInfo[] }> = ({ links }) => {
  const router = useRouter();

  const activeClass = (link: LinkInfo) =>
    link.href === router.pathname ? styles.active : "";

  return (
    <ul>
      {links.map(link => (
        <li key={link.href} className={activeClass(link)}>
          <Link href={link.href}>
            <a title={link.title}>{link.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const Links: ComponentType = () => {
  return (
    <Fragment>
      <div className={cn(styles.links, styles.mainLinks)}>
        <LinkList links={mainLinks} />
      </div>
      <div className={cn(styles.links, styles.demoLinks)}>
        <LinkList links={demoLinks} />
      </div>
    </Fragment>
  );
};
