module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',

      url: [
        "/",
        "/index.html",
        "/404.html",
        "/explore/documents.html",
        "/explore/editions.html",
        "/explore/people.html",
        "/explore/towns.html",
        "/get-started/guides.html",
        "/get-started/guides/finding-documents.html",
        "/get-started/guides/linguists.html",
        "/document/Al641.html",
      ]
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};