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
      assertions: {
        //Global Fallback Rule
        'accessibility': ['error', { minScore: 0.90 }],

        'accessibility': [
          'error',
          {
            minScore: 0.98,
            matchingUrlPattern: '.*index\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 1.0,
            matchingUrlPattern: '.*404\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 1.0,
            matchingUrlPattern: '.*404\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 1.0,
            matchingUrlPattern: '.*people\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 1.0,
            matchingUrlPattern: '.*towns\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 1.0,
            matchingUrlPattern: '.*guides\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 1.0,
            matchingUrlPattern: '.*finding-documents\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 1.0,
            matchingUrlPattern: '.*linguists\\.html$'
          }
        ],
        'accessibility': [
          'error',
          {
            minScore: 0.90,
            matchingUrlPattern: '.*Al642\\.html$'
          }
        ]
      }
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