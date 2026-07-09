module.exports = {
  ci: {
    collect: {
      staticDistDir: './lhci-root',
      url: [
        "/digital-text-explorer/",
        "/digital-text-explorer/index.html",
        "/digital-text-explorer/404.html",
        "/digital-text-explorer/explore/documents.html",
        "/digital-text-explorer/explore/editions.html",
        "/digital-text-explorer/explore/people.html",
        "/digital-text-explorer/explore/towns.html",
        "/digital-text-explorer/get-started/guides.html",
        "/digital-text-explorer/get-started/guides/finding-documents.html",
        "/digital-text-explorer/get-started/guides/linguists.html",
        "/digital-text-explorer/document/Al642.html"
      ],
      numberOfRuns: 1,
    },
    assert :{
      assertions: [
        {
          matchingUrlPattern: '.*index\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 0.98 }]
          }
        },
        {
          matchingUrlPattern: '.*404\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 1.0 }]
          }
        },
        {
          matchingUrlPattern: '.*people\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 1.0 }]
          }
        },
        {
          matchingUrlPattern: '.*towns\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 1.0 }]
          }
        },
        {
          matchingUrlPattern: '.*guides\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 1.0 }]
          }
        },
        {
          matchingUrlPattern: '.*finding-documents\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 1.0 }]
          }
        },
        {
          matchingUrlPattern: '.*linguists\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 1.0 }]
          }
        },
        {
          matchingUrlPattern: '.*Al642\\.html$',
          assertions: {
            'categories:accessibility':['error', { minScore: 0.9 }]
          }
        },
      ]
    },
    settings: {
      urlReplacementPatterns: [
        's#.*/digital-text-explorer/##g'
      ]
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};