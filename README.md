# React Translations

## Short Example

```js
import { T, Translate } from "interminimal";

// Multlingual string
const message = { en: "Hello", fr: "Bonjour" };

function MyThing() {
  const [lang, setLang] = useState("en");
  const langs = ["en", "fr", "de"];
  return (
    // Select the current language, dictionary is inherited
    <Translate lang={lang}>
      <T as="h1" tag="heading" />
      {/* Buttons */}
      {langs.map(lang => (
        <T key={lang} as="button" tag={lang} onClick={() => setLang(lang)} />
      ))}
      <T as="p" text={message} />
    </Translate>
  );
}

const dictionary = {
  // Language names
  en: { en: "English", fr: "Anglais" },
  fr: { fr: "Français" },
  de: { en: "German", fr: "Allemand", de: "Deutsch" },
  // Page heading
  heading: {
    en: "Let's Translate!",
    fr: "Traduisons!",
    de: "Lassen Sie uns übersetzen!"
  }
};

function MyApp() {
  return (
    // Set the dictionary to use
    <Translate translation={dictionary}>
      <MyThing />
    </Translate>
  );
}
```

# Let's Translate!

As you can see in the example above you can translate your text using just two components: `Translate` which creates a translation context and `T` which translates individual chunks of text.

## `Translate` - the translation context

The translation context dictates the translation settings for all components below it. Contexts may be freely nested with each overriding one or more properties from the context above it.

```js
function MyThing() {
  return (
    <Translate translation={dictionary} lang="en">
      {/* english */}
      <T as="p" text={oneString} />
      <Translate lang="cy">
        {/* welsh */}
        <T as="p" text={anotherString} />
      </Translate>
    </Translate>
  );
}
```

## `T` - the translator

The `T` component represents translatable text. It will attempt to render using the language specified by containing translation context.

Here are some of the things `T` can do:

- translate fat strings like `{ en: "English", cy: "Cymraeg" }`
- handle pluralisation (even fatter strings)
- look up tagged translations in a dictionary
- add a `lang` attribute only when necessary
- translate other attributes (e.g. `alt` on an `img`, `title` etc)
- perform flexible template subsitution
- wrap arbitrary HTML elements and React components with translation goodness.

### Fat Strings

We represent multilingual content as objects that have ISO 639-1 language codes as keys and corresponding translated text as values. Internally Interminimal casts fat strings into `TString` objects.

Here's a simple example:

```js
{ en: "English", cy: "Cymraeg" }
```

When looking for a translation `T` tries the context's desired language `lang` first, then its `defaultLang`. If neither of those are present it will use the first of any languages present in the fat string. Translation can only fail completely is the fat string is just an empty object.

Fat strings can also handle pluralisation - which is quite involved for languages such as Welsh. Here's how we'd represent translations for a count of cats. The `%1` in the strings is a placeholder for the number of cats - we'll see how to use that soon.

```js
// Combien de moggie?
const cats = {
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
};
```

### Dictionaries

Translation dictionaries are plain objects that map tags to fat strings:

```js
const dictionary = {
  lang: { en: "English", cy: "Cymraeg" },
  cats: {
    en: { one: "%1 cat", other: "%1 cats" },
    de: { one: "%1 Katze", other: "%1 Katzen" }
  }
};
```

In order to use a dictionary pass it to a `Translate` to add it to the translation context:

```js
function MyApp() {
  return (
    // Set the dictionary to use
    <Translate translation={dictionary}>
      <MyThing />
    </Translate>
  );
}
```

### Using `T`

The simplest use of `T` is to translate a simple fat string. By default the translated text is wrapped in a `span`.

```js
const language = { en: "English", cy: "Cymraeg" };
return <T text={language} />;
// when en: <span>English</span>
// when cy: <span>Cymraeg</span>
// when de: <span lang="en">English</span>
```

Note that when we ask for a language for which there's no translation we get the default language (in this case "en") and the `span` has `lang` attribute to declare that it's a different language from the surrounding text.

We can also look up translations by their dictionary tag. This code has the same effect as the example above.

```js
// Assumes the dictionary example from above
return <T tag="language" />;
// This also works
return <T text={["language"]} />;
```

When text is a single element array it is treated as a tag. This is to allow us to mix fat strings and dictionary tags in our data structures and render them with the same code.

If we need an element other than `span` we can tell `T` what to use:

```js
return <T as="h1" tag="language" />;
// <h1>English<h1> / <h1>Cymraeg</h1> / <h1 lang="en">English<h1>
```

If you prefer you can use the `tBind` helper to make a new component which always renders as a particular element:

```js
import { tBind, tBindMulti } from "interminimal";
const Toption = tBind("option");
const [Tdiv, Tp] = tBindMulti(["div", "p"]);
return <Tdiv tag="language" />;
```

`tBind` accepts an HTML element tag or a React component.

### Properties

All unknown properties (with the exception of `text`, `tag`, `as` and `count`) are passed to the underlying element.

```js
return <T as="option" value="X" tag="language" />;
// <option value="X">English</option>
```

We can also ask for properties to be translated by adding `Text` to the end of their name:

```js
// Fat string
const caption = { en: "Hello", de: "Hallo" };
return <T as="img" altText={caption} src="i/pic.jpg" />;

// Dictionary
return <T as="img" altText={["caption"]} src="i/pic.jpg" />;
```

As noted above a fat string whose value is a single element array is treated as a dictionary tag. That allows us to get property translations from either the dictionary or fat strings.

### Template strings

Translations can be templated. Placeholders in the translated string (`%1`, `%2` etc) are replaced with the corresponding child components of the `T`.

```js
const translation = {
  // Numbers
  one: { en: "One", fr: "Un", de: "Ein", cy: "Un" },
  two: { en: "Two", fr: "Deux", de: "Zwei", cy: "Dwy" },
  // Message
  info: {
    // Demo substitution
    en: "The word for 1 is %1 and the word for 2 is %2",
    fr: "Le mot pour 2 est %2 et le mot pour 1 est %1"
  }
};

return (
  <T tag="info">
    <T tag="one" />
    <T tag="two" />
  </T>
);
// when cy
//    <span lang="en">
//       The word for 1 is
//       <span lang="cy">Un</span>
//       and the word for 2 is
//       <span lang="cy">Dwy</span>
//    </span>
//
// when fr
//    <span>
//      Le mot pour 2 est
//      <span>Deux</span>
//      et le mot pour 1 est
//      <span>Un</span>
//    </span>
```

There is no Welsh ("cy") translation for the `"info"` tag so we get the default English version of that text but the numbers are still correctly translated into Welsh. Because the Welsh words "Un" and "Dwy" are inside English text they get a `lang="cy"` attribute to switch back to Welsh. This is because `T` is aware of the "ambient" language and adds the `lang` attribute if the ambience doesn't match its translation.

The French version of the info text reverses the order of the substitutions.

The children of the templated `T` can be of any kind. For example we could embolden the translation for "two".

```js
return (
  <T tag="info">
    <T tag="one" />
    <strong>
      <T tag="two" />
    </strong>
  </T>
);
```

### Plurals: Let's Count Cats!

Different languages have different rules for forming plurals. They also have different kinds of plurals: Welsh has six. Here's how we count cats in English, German and Welsh

```js
// A pluralised, templated fat string.
const cats = {
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
};

function Cats({ count }) {
  // We stringify count because otherwise when we try to count 0 cats
  // React treats the falsy 0 as a non-existent component because 0 is
  // false but "0" is true.
  return (
    <T text={cats} count={count}>
      {String(count)}
    </T>
  );
}

function CountCats() {
  const counts = [0, 1, 1.5, 2, 3, 6, 42];
  return (
    <div>
      {counts.map(count => (
        <Cats count={count} />
      ))}
    </div>
  );
}

// You're here for the Welsh cats, right?
//    0 cathod
//    1 gath
//    1.5 cath
//    2 gath
//    3 cath
//    6 chath
//    42 cath
```

Plurals don't have to be templated but it's often a good idea because it allows the translator to vary the when the number appears in the text.

# Summary

`Translate` creates a translation context. Any use of `T` in components below the `Translate` will attempt to translate text according to the context settings. `Translate` can be nested to any depth. Each `Translate` inherits and potentially overrides settings from its parent context. The most interesting properties of a translation context are `lang`, `defaultLang` and `translation` (the dictionary).

`T` attempts to translate text in fat strings or from the dictionary. It can translate content and attributes. By default `T` renders as a span but it can be asked to render as any element or component.

`T` supports plurals and templating. Templating can nest to any depth. Templates can re-order child components.
