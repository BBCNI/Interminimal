import React, { ComponentType, FunctionComponent, ReactNode, Ref } from "react";
import R from "react-test-renderer";

import { As, Translate, T, tBind, tBindMulti } from "./components";

import { TDictionaryRoot } from "./types";

const dictionary: TDictionaryRoot = {
  $$dict: {
    site: { en: "Interminimal" },
    heading: {
      en: "Let's Translate!",
      fr: "Traduisons!",
      de: "Lassen Sie uns übersetzen!"
    },
    maybe: { $$dict: { site: { en: "Something else" } } }
  }
};

interface MyLinkProps {
  ref?: Ref<string>;
  href: string;
  refValue: string;
  children: ReactNode;
}

const MyLink: ComponentType<MyLinkProps> = React.forwardRef<
  string,
  MyLinkProps
>(({ children, href, refValue }, ref) => {
  // @ts-ignore
  if (ref) ref.current = refValue;
  return <a href={href}>{children}</a>;
});

beforeEach(() => {
  jest.spyOn(console, "error");
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockImplementation(() => null);
});

afterEach(() => {
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockRestore();
});

describe("Interminimal Components", () => {
  it("should render <As>", () => {
    expect(R.create(<As as="div" />).toJSON()).toMatchSnapshot();
    expect(R.create(<As as="h1" />).toJSON()).toMatchSnapshot();
  });

  it("should render <Translate>", () => {
    expect(
      R.create(
        <Translate lang="fr">
          <T text="Hello" />
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
    expect(
      R.create(
        <Translate lang="en">
          <T text="Hello" />
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should render templates", () => {
    expect(
      R.create(
        <Translate lang="en">
          <T text="Second: %2, first: %1">
            <T text="One" />
            <T text="Two" />
          </T>
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should render content", () => {
    expect(
      R.create(
        <Translate lang="en">
          <T content="Second: %2, first: %1" />
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should allow element of Translate to be overridden", () => {
    expect(
      R.create(
        <Translate as="p" lang="en">
          <T content="Hello!" />
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should bind T to a tag", () => {
    const [Tp, Ti] = tBindMulti(["p", "i"]);
    expect(
      R.create(
        <Translate lang="en">
          <Tp text="para" />
          <Ti text="italic" />
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should bind T as a component", () => {
    const TMyLink = tBind(MyLink as FunctionComponent);
    expect(
      R.create(
        <Translate lang="en">
          <TMyLink href="/" text="Link" />
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should resolve tags", () => {
    expect(
      R.create(
        <Translate lang="en" dictionary={dictionary}>
          <T tag="heading" />
          <Translate lang="fr">
            <T tag="heading" />
          </Translate>
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should translate properties", () => {
    expect(
      R.create(
        <Translate lang="en" dictionary={dictionary}>
          <T t-title={["heading"]}>Some text</T>
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should pass template fragments down", () => {
    const ts = { en: "Here is a %1[link] and this %2[is italic]" };
    expect(
      R.create(
        <Translate lang="en">
          <T text={ts}>
            <T as="a" href="/" tag="%1" />
            <T as="i" tag="%2" />
          </T>
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
  });

  it("should pass refs via Format", () => {
    const ref = React.createRef<boolean>();

    // Test that MyLink gets a ref even though there's no explicit
    // ref in it's properties.
    expect(
      R.create(
        <Translate lang="en">
          <T ref={ref} text="[%1]">
            <MyLink refValue="foo" href="/">
              Link
            </MyLink>
          </T>
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
    expect(ref.current).toBe("foo");
  });

  ////////////////////
  // Negative cases //
  ////////////////////

  it("should fail for indexes out of range", () => {
    expect(() =>
      R.create(
        <Translate lang="en">
          <T text="%0">
            <T as="a" href="/" tag="%1" />
          </T>
        </Translate>
      )
    ).toThrow(/out of range/);
  });

  it("should fail for unused children", () => {
    expect(() =>
      R.create(
        <Translate lang="en">
          <T text="%1">
            <span />
            <span />
          </T>
        </Translate>
      )
    ).toThrow(/unused args/i);
  });

  it("should fail for reused children", () => {
    expect(() =>
      R.create(
        <Translate lang="en">
          <T text="%1%1">
            <span />
          </T>
        </Translate>
      )
    ).toThrow(/already/i);
  });

  it("should fail if tag + content provided", () => {
    expect(() =>
      R.create(
        <Translate lang="en">
          <T tag="foo" content="bar" />
        </Translate>
      )
    ).toThrow(/don't mix/);
  });

  it("should fail to pass refs to multiple children", () => {
    const ref = React.createRef();
    expect(() =>
      R.create(
        <Translate lang="en">
          <T ref={ref} text="%1%2">
            <T as="a" href="/" text="foo" />
            <T as="i" text="bar" />
          </T>
        </Translate>
      )
    ).toThrow(/only forward/);
  });

  it("should fail to pass refs non-element", () => {
    const ref = React.createRef();
    expect(() =>
      R.create(
        <Translate lang="en">
          <T ref={ref} text="%1%2">
            Hello!
          </T>
        </Translate>
      )
    ).toThrow(/non-element/i);
  });
});