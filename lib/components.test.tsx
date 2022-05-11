import React, { ComponentType, ReactNode, Ref } from "react";
import R from "react-test-renderer";

import { As, Translate, T, tBindMulti } from "./components";

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

  it("should pass refs", () => {
    const ref = React.createRef<boolean>();

    interface MyLinkProps {
      ref?: Ref<boolean>;
      children: ReactNode;
    }

    const MyLink: ComponentType<MyLinkProps> = React.forwardRef<
      boolean,
      MyLinkProps
    >(({ children }, ref) => {
      // @ts-ignore
      if (ref) ref.current = true;
      return <span>{children}</span>;
    });

    expect(
      R.create(
        <Translate lang="en" dictionary={dictionary}>
          <T ref={ref} text="[%1]">
            <MyLink>Link</MyLink>
          </T>
        </Translate>
      ).toJSON()
    ).toMatchSnapshot();
    expect(ref.current).toBeTruthy();
  });

  // Negative cases
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
});
