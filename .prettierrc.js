/**
 * Prettier Configuration
 * Code formatting rules
 */

module.exports = {
  // Line width
  printWidth: 100,

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Semicolons
  semi: true,

  // Quotes
  singleQuote: true,
  quoteProps: 'as-needed',

  // Trailing commas
  trailingComma: 'none',

  // Spacing
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrows
  arrowParens: 'always',

  // End of line
  endOfLine: 'lf',

  // Other
  insertFinalNewline: true,
  proseWrap: 'preserve',

  // Ignore files
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80
      }
    },
    {
      files: '*.json',
      options: {
        printWidth: 80
      }
    }
  ]
};
