const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // Add syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addGlobalData("layout", "base.njk");

  // Handle asset copying
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");

  // Process Markdown links and images
  eleventyConfig.addTransform("content-processing", function (content) {
    // Fix image paths if needed
    content = content.replace(/!\[\[(.*?)\]\]/g, function (match, p1) {
      return `<img src='/${p1}' />`;
    });

    // Convert wiki-style links to regular markdown links
    content = content.replace(/\[\[(.*?)\]\]/g, function (match, p1) {
      const [title, alias] = p1.split("|");
      const displayText = alias || title;
      const url = title === "index" ? "" : title.toLowerCase().replace(/ /g, "-");
      return `<a href='/${url.toLowerCase().replace(/ /g, "-")}'>${displayText}</a>`;
    });

    return content;
  });

  // Configure markdown processing
  var markdownItAttrs = require('markdown-it-attrs');
  let markdownIt = require("markdown-it");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };

  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItAttrs));

  return {
    dir: {
      input: ".",    // Look for source files in articles directory
      output: "_site",      // Output to _site directory
      includes: "_includes",  // Look for includes in parent directory
      layouts: "_includes/layouts"
    },         // Update this if site is not at root of domain
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk"
  };
};
