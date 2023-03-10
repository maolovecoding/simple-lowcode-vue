module.exports = {
  "disableEmoji": false,
  "list": [
    "test",
    "feat",
    "fix",
    "chore",
    "docs",
    "refactor",
    "style",
    "ci",
    "perf"
  ],
  "maxMessageLength": 64,
  "minMessageLength": 3,
  "questions": [
    "type",
    "scope",
    "subject",
    "body",
    "breaking",
    "issues",
    "lerna"
  ],
  "scopes": [],
  "types": {
    "chore": {
      "description": "Build process or auxiliary tool changes",
      "emoji": "π€", // ε½εη±»εηcommitζζΎη€Ίηθ‘¨ζ
      "value": "chore"
    },
    "ci": {
      "description": "CI related changes",
      "emoji": "π‘",
      "value": "ci"
    },
    "docs": {
      "description": "Documentation only changes",
      "emoji": "βοΈ",
      "value": "docs"
    },
    "feat": {
      "description": "A new feature",
      "emoji": "πΈ",
      "value": "feat"
    },
    "fix": {
      "description": "A bug fix",
      "emoji": "π",
      "value": "fix"
    },
    "perf": {
      "description": "A code change that improves performance",
      "emoji": "β‘οΈ",
      "value": "perf"
    },
    "refactor": {
      "description": "A code change that neither fixes a bug or adds a feature",
      "emoji": "π‘",
      "value": "refactor"
    },
    "release": {
      "description": "Create a release commit",
      "emoji": "πΉ",
      "value": "release"
    },
    "style": {
      "description": "Markup, white-space, formatting, missing semi-colons...",
      "emoji": "π",
      "value": "style"
    },
    "test": {
      "description": "Adding missing tests",
      "emoji": "π",
      "value": "test"
    }
  },
  messages: {
    type: 'Select the type of change that you\'re committing:',
    customScope: 'Select the scope this component affects:',
    subject: 'Write a short, imperative mood description of the change:\n',
    body: 'Provide a longer description of the change:\n ',
    breaking: 'List any breaking changes:\n',
    footer: 'Issues this commit closes, e.g #123:',
    confirmCommit: 'The packages that this commit has affected\n',
  },
}
