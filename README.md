# jQuery ‘Renderer’ for Express

Are you nostalgic for when the web was just three PHP scripts that your cousin
stapled together in your uncle's basement and glued some snazzy dollar-sign
heavy Javascript onto? Want to experience the same thrill but in a
everything-is-now-JavaScript-maybe-even-the-kernel-who-really-can-tell
package? Seek no further! Now you too can write your Express app with jQuery!

## What (taf) is this?!

This is an Express rendering engine that loads HTML ‘templates’
into JSDOM (a JavaScript implementation of the browser's DOM) and allows
you to manipulate that using jQuery.

## Why should I use this?

You shouldn't. Seriously. It's a joke. Use a sensible templating engine, or 
even a fancy newfangled server side rendering/full-stack thing
that'll leave you perpetually confused about whether your code is running
on the server or the client. Anything. Not this.

## I'm using it anyways

_\*Sigh\*_, okay fine. Your express app will pick up the rendering engine automatically if
your templates have the `.jqhtml` extension, but you will need to install a middleware so
to set some metadata for the DOM:

```js
import express from "express";
import { jqHtmlMiddleware } from "jqhtml";

const app = express();
app.use(jqHtmlMiddleware);
```

You then create a `.jqhtml` page in your views folder an just call the `render()` method on the
response object of your route: 

```js
app.get("/", (req, res) => {
  res.render("index.jqhtml", {
    onRender($) {
      $("body").append(`<p>Hello world!</p>`);
    },
  });
});
```

As you can see, jqhtml supports just a single option, the `onRender()` callback, which will receive
a jQuery instance that can manipulate the document before sending it back to the client. You can also
look at the `example/` folder for a complete example.

