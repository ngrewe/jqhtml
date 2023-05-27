import { AsyncLocalStorage } from "async_hooks";
import { RequestHandler } from "express";
import type jQuery from "jquery";
import { DOMWindow, FileOptions, JSDOM } from "jsdom";
const jQueryFactory: (window: DOMWindow) => typeof jQuery = require("jquery");


export type JQuery = typeof jQuery;
export interface JqHtmlOptionsContainer<T> {
  jqHtmlOptions: T;
}

/**
 * This is the type of the `options` that are passed to the Express `render()` function.
 * In particularly, the "engine" will call the `onRender()` function where you can use
 * jQuery to manipulate the page.
 */
export type JqHtmlRenderOptions<T extends object = any> = T & {
  /** The render function for jquery manipulations */
  onRender?(
    /** The jQuery object */
    $: typeof jQuery,
    /** The window on which to operate */
    window: DOMWindow & Omit<JqHtmlOptionsContainer<T>, 'onRender'>
  ): Promise<void>;
};

const asyncStorage = new AsyncLocalStorage<FileOptions>();

/**
 * This middleware ensures that jqHtml can process your request correctly.
 */
export const jqHtmlMiddleware: RequestHandler = (req, _res, next) => {
  const options = {
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
    referrer: req.get("Referer"),
  };
  asyncStorage.run(options, () => next());
};

const THREW = Symbol("THREW");

/**
 * 
 */
export const __express: <T extends object = any>(
  path: string,
  options: JqHtmlRenderOptions<T>,
  callback: (e: any, rendered?: string) => void
) => void = (path, options, callback) => {
  engine(path, options)
    .catch((e: any) => {
      callback(e);
      return THREW as typeof THREW;
    })
    .then((html) => typeof html === "string" && callback(null, html));
};

const engine = async <T extends object = any>(path: string, options: JqHtmlRenderOptions<T>) => {
  const domOptions = asyncStorage.getStore();
  console.log("path", path, domOptions);
  const { window } = await JSDOM.fromFile(path, domOptions);
  if ("onRender" in options && typeof options.onRender === "function") {
    const jquery = jQueryFactory(window);
    const optionCopy = { ...options };
    delete optionCopy["onRender"];
    await options.onRender(
      jquery,
      Object.assign(window, { jqHtmlOptions: optionCopy })
    );
  }
  return "<!DOCTYPE HTML>\n" + window.document.documentElement.outerHTML;
};