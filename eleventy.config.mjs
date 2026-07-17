import cleancss from 'clean-css';
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.setIncludesDirectory("_templates");
  eleventyConfig.setInputDirectory("src");
  eleventyConfig.setOutputDirectory("dist");

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addFilter('cssmin', function(code) {
    return new cleancss({}).minify(code).styles
  })
  eleventyConfig.addFilter('jsonify', (data) => {
    return JSON.stringify(data, null, "\t")
  })  
  eleventyConfig.addFilter('uri_encode', function(str) {
    return encodeURIComponent(str)
  })
  eleventyConfig.addFilter('title_display', function(str) {
    if (!str) return ''
    return str.replace(/_/g, ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  })
  eleventyConfig.addFilter('contains', function(text, str) {
    if (!text || !str) return false
    return text.includes(str)
  });
  eleventyConfig.addLayoutAlias('base', 'layouts/base.html')
  eleventyConfig.addLayoutAlias('document', 'layouts/document.html')
  eleventyConfig.addLayoutAlias('home', 'layouts/home.html')
  eleventyConfig.addLayoutAlias('page', 'layouts/page.html')

  eleventyConfig.addPassthroughCopy('static', 'static')
  eleventyConfig.addPassthroughCopy({ 'src/_data/api': 'api' })
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' })
  eleventyConfig.addPassthroughCopy({ 'node_modules/mirador/dist': 'js/mirador' })
  eleventyConfig.addPassthroughCopy({ 'node_modules/jspdf/dist': 'js/jspdf' })

  
  return {
    pathPrefix: '/digital-text-explorer',
    markdownTemplateEngine: 'liquid'
  }
}
