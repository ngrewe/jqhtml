import express from "express";
import { JqHtmlRenderOptions, jqHtmlMiddleware } from "jqhtml";

const app = express();
const port = 3000;

app
  .use(jqHtmlMiddleware)
  .set("views", "views/")
  .get("/", (req, res) => {
    const options: JqHtmlRenderOptions = {
      onRender($) {
        $("body").append(`<p>Hello world!</p>`);
      },
    };
    res.render("index.jqhtml", options);
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
