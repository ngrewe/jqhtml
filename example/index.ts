import express from "express";
import { jqHtmlMiddleware, JQuery } from "jqhtml";

const app = express();
const port = 3000;

app
  .use(jqHtmlMiddleware)
  .set("views", "views/")
  .get("/", (_req, res) => {
    res.render("index.jqhtml", {
      onRender($: JQuery) {
        $("body").append(`<p>Hello world!</p>`);
      },
    });
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
