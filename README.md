# React Translations

## An Example

```js
import { T, Translate } from "interminimal";

// Multlingual fat string
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
  $$dict: {
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
  }
};

function MyApp() {
  return (
    // Set the dictionary to use
    <Translate dictionary={dictionary}>
      <MyThing />
    </Translate>
  );
}
```

# Let's Translate!

As you can see in the example above you can translate your text using just two components: `Translate` which creates a translation context and `T` which translates individual chunks of text.

## `Translate` - the translation context

The translation context dictates the translation settings for all components below it. Contexts may be freely nested with each overriding one or more properties from the context above it. The most interesting properties of a translation context are `lang`, `defaultLang` and `dictionary`.

```js
function MyThing() {
  return (
    <Translate dictionary={dictionary} lang="en">
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

The `T` component represents translatable text. It will attempt to render using the language specified by the containing translation context.

Here are some of the things `T` can do:

- translate fat strings like `{ en: "Hello", fr: "Bonjour" }`
- handle pluralisation (even fatter strings)
- look up tagged translations in a dictionary
- add a `lang` attribute only when necessary
- translate other properties (e.g. `alt`, `title`)
- perform flexible template subsitution
- wrap arbitrary HTML elements and React components with translation goodness.

## Fat Strings

We represent multilingual content as objects that have ISO 639-1 language codes as keys and corresponding translated text as values. Internally Interminimal casts fat strings into `TString` objects.

Here's a simple example:

```js
{ en: "Hello", fr: "Bonjour" }
```

When looking for a translation `T` tries the containing context's desired language `lang` first. If that fails to find a translation it walks up the context stack trying each `lang` in turn. Then it tries `defaultLang`. If none of those yield a translation it will use the first of any languages present in the fat string. Translation can only fail completely is the fat string is just an empty object.

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

## Dictionaries

Translation dictionaries have a `$$dict` key that contains an object that map tags to fat strings:

```js
const dictionary = {
  $$dict: {
    greeting: { en: "Hello", de: "Güten Tag" },
    cats: {
      en: { one: "%1 cat", other: "%1 cats" },
      de: { one: "%1 Katze", other: "%1 Katzen" }
    }
  }
};
```

In order to use a dictionary pass it to a `Translate` to add it to the translation context:

```js
function MyApp() {
  return (
    // Set the dictionary to use
    <Translate dictionary={dictionary}>
      <MyThing />
    </Translate>
  );
}
```

Nested translation contexts may provide topical dictionaries to override or augment dictionaries in containing contexts. This allows, for example, a component to provide its own translations which will temporarily augment the main dictionary.

## Using `T`

The simplest use of `T` is to translate a simple fat string. By default the translated text is wrapped in a `span`.

```js
const greeting = { en: "Hello", fr: "Bonjour" };

return <T text={greeting} />;

// when en: <span>Hello</span>
// when fr: <span>Bonjour</span>
// when de: <span lang="en">Hello</span>
```

Note that when we ask for a language for which there's no translation we get the default language (in this case "en") and the `span` has `lang` attribute to declare that it's a different language from the surrounding text.

We can also look up translations by their dictionary tag. This code has the same effect as the example above.

```js
// Assumes the dictionary example from above
return <T tag="greeting" />;

// This also works
return <T text={["greeting"]} />;
```

When `text` is a single element array it is treated as a tag. This is to allow us to mix fat strings and dictionary tags in our data structures and render them with the same code. It also helps when we translate properties - more on that soon.

If we need an element other than `span` we can tell `T` what to render:

```js
return <T as="h1" tag="greeting" />;
// <h1>Hello<h1> / <h1>Güten Tag</h1> / <h1 lang="en">Hello<h1>
```

The `as` property can be an HTML element name or a function or class React component.

If you prefer you can use the `tBind` helper to make a new component which always renders as a particular element:

```js
import { tBind, tBindMulti } from "interminimal";

const Toption = tBind("option");
const [Tdiv, Tp] = tBindMulti(["div", "p"]);

return <Tdiv tag="language" />;
```

`tBind` also accepts an HTML element name or a React component.

## Properties

With the exception of `text`, `tag`, `content`, `as` and `count`, `T` passes remaining properties to the underlying element.

```js
return <T as="option" value="X" tag="language" />;
// <option value="X">English</option>
```

We can also ask for properties to be translated by prefixing them with `t-`.

```js
// Fat string
const caption = { en: "Hello", de: "Hallo" };

return <T as="img" t-alt={caption} src="i/pic.jpg" />;

// Dictionary
return <T as="img" t-alt={["caption"]} src="i/pic.jpg" />;
```

As noted above a fat string whose value is a single element array is treated as a dictionary tag. That allows us to get property translations from either the dictionary or fat strings.

We don't have to limit ourselves properties containing human text. We could switch the image too.

```js
// Fat string
const caption = { en: "Hello", de: "Hallo" };
const pic = { en: "i/pic.jpg", de: "i/pic-de.jpg" };

return <T as="img" t-alt={caption} t-src={pic} />;
```

## Template strings

Translations can be templated. Placeholders in the translated string (`%1`, `%2` etc) are replaced with the corresponding child components of the `T`.

If you know your fat strings are not templated you should use the `content` property of `T` to [disable template substitution](#disabling-template-substitution).

When you do want template substitution this is how it works.

```js
const dictionary = {
  $$dict: {
    // Numbers
    one: { en: "One", fr: "Un", de: "Ein", cy: "Un" },
    two: { en: "Two", fr: "Deux", de: "Zwei", cy: "Dau" },
    // Message
    info: {
      // Demo substitution
      en: "The word for 1 is %1 and the word for 2 is %2",
      fr: "Le mot pour 2 est %2 et le mot pour 1 est %1"
    }
  }
};

return (
  <Translate dictionary={dictionary}>
    <T tag="info">
      <T tag="one" />
      <T tag="two" />
    </T>
  </Translate>
);
// when cy
//    <span lang="en">
//       The word for 1 is
//       <span lang="cy">Un</span>
//       and the word for 2 is
//       <span lang="cy">Dau</span>
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

In that example there is no Welsh ("cy") translation for the `"info"` tag so we get the default English version of that text but the numbers are still correctly translated into Welsh. Because the Welsh words "Un" and "Dau" are inside English text they get a `lang="cy"` attribute to switch back to Welsh. This is because `T` is aware of the "ambient" language and adds the `lang` attribute if the ambience doesn't match its translation.

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

## Inline text in template placeholders

The example above looks up the tags `"one"` and `"two"` in the dictionary and will translate them independently of the containing template. Sometimes it's more convenient to keep all the parts of the string together. Suppose we want to add translation to this markup:

```html
<span>Here's a <a href="/">useful link</a> and here's some <i>italic text<i></span>
```

Here's how we might do it:

```js
// Simpler to translate
const message = {
  en: "Here's a %1[useful link] and here's some %2[italic text]",
  fr: "Voici %2[du texte en italique] et un %1[lien utile]"
};

return (
  <T text={message}>
    <T as="a" href="/" tag="%1" />
    <T as="i" tag="%2" />
  </T>
);
// En Français:
//   <p>Voici <i>du texte en italique</i> et un <a href="/">lien utile</a></p>
```

Within the nested components any text `[in square brackets]` after the placeholder will be available as tags named after that placeholder: `%1`, `%2` etc.

For child components that need multiple text substitutions you can nest placeholders:

```js
const silly = {
  en:
    "Top level %1[Level one %1[Level two] and" +
    " %2[also level two with %1[level three]]]",
  fr:
    "Niveau supérieur %1[Niveau un %1[Niveau deux]" +
    " et %2[aussi niveau deux avec %1[niveau trois]]]"
};

return (
  <T text={silly}>
    <T tag="%1">
      <T tag="%1" />
      <T tag="%2">
        <T tag="%1" />
      </T>
    </T>
  </Tp>
);
```

## Tag lookup in templates

We can also interpolate the contents of tags (looked up in the dictionary chain) into template strings. A template string like `"The name of this site is %{site}"` will look for a tag called `site` and substitute it. This substitution happens early in the rendering of the string so the substituted text can provide further placeholders.

## Disabling template substitution

Often you will receive translated text that should not be parsed as a template. If, for example, you recieve the translated text of a blog post from an API you need to be able to render it without worrying that it might contain tokens like `%123` which would be interpreted as placeholders - and which would cause your application to throw an error.

In such cases use the `content` attribute of `T`:

```js
// Don't parse postBody as a template string.
return <T content={postBody}>;
```

Note that you can pass a `["tag"]` as the `content` property to cause dictionary lookup:

```js
return <T content={["literal"]}>;
```

## Template Syntax Summary

We've seen that `%\d+` introduces a placeholder into a template string. Placeholders may optionally be followed by `[text in brackets]` that will be available to child components. There may be no spaces between the placeholder and the opening `[`.

To interpolate the contents of a translation from the dictionary we use `%{tagName}`.

A `%` followed by `%`, `[` or `]` escapes that character:

- for `%` use `%%`
- for `[` after a placeholder use `%[`
- for `]` inside placeholder text use `%]`

The brackets `[` and `]` are only special after a placeholder - you can use them anywhere else without escaping them.

Apart from their use in `%{tagName}` `{` and `}` also have no special significance and may be used unescaped.

Any `%` that isn't followed by a digit or `%`, `[` or `]` is passed through unaltered.

# Plurals: Let's Count Cats!

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
    <T as="div" text={cats} count={count}>
      {String(count)}
    </T>
  );
}

function CountCats() {
  const counts = [0, 1, 1.5, 2, 3, 6, 42];
  return (
    <div>
      {counts.map((count, i) => (
        <Cats key={i} count={count} />
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

The `count` property of `T` is used select the language-appropriate plural.

Plurals don't have to be templated but it's often a good idea because it allows the translator to vary where the number appears in the text.

# Summary

`Translate` creates a translation context. Any use of `T` in components below the `Translate` will attempt to translate text according to the context settings. `Translate` can be nested to any depth. Each `Translate` inherits and potentially overrides settings from its parent context. The most interesting properties of a translation context are `lang`, `defaultLang` and `dictionary`.

`T` attempts to translate text in fat strings or from the dictionary. It can translate content and properties. By default `T` renders as a span but it can be asked to render as any element or component.

`T` supports plurals and templating. Templating can nest to any depth. Templates can re-order child components.

## CI Status

![CI Status](https://github.com/BBCNI/Interminimal/actions/workflows/node.js.yml/badge.svg)

[![CodeQL](https://github.com/BBCNI/Interminimal/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/BBCNI/Interminimal/actions/workflows/codeql-analysis.yml)

## License

[MIT](LICENSE)
