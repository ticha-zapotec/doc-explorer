import cleancss from 'clean-css';
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // minify css filter
  eleventyConfig.addFilter('cssmin', function(code) {
    return new cleancss({}).minify(code).styles;
  })

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // inspect objects as JSON
  eleventyConfig.addFilter('jsonify', (data) => {
    return JSON.stringify(data, null, "\t")
  })  

  eleventyConfig.addLayoutAlias('base', 'layouts/base.html')

  eleventyConfig.addPassthroughCopy('static', 'static')
  
  return {
    pathPrefix: '/ticha-doc-explorer',
    markdownTemplateEngine: 'liquid',
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}