module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',

      url: [
        "/",
        "/index/",
        "/404/",
        "/explore/documents/",
        "/explore/editions/",
        "/explore/people/",
        "/explore/towns/",
        "/get-started/guides",
        "/get-started/guides/finding-documents/",
        "/get-started/guides/linguists/",
        "/document/Al641",
      ]
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};