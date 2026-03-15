import tseslint from 'typescript-eslint';

export default tseslint.config(
  { files: ['src/**/*.ts', 'tests/**/*.ts'] },
  ...tseslint.configs.recommended,
);
