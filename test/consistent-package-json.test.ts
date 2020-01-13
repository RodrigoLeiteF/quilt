import {dirname, join, relative, resolve} from 'path';

import {readJSONSync} from 'fs-extra';
import glob from 'glob';

const KNOWN_TEMPLATE_KEYS = [
  'author',
  'bugs',
  'dependencies',
  'description',
  'files',
  'homepage',
  'license',
  'main',
  'name',
  'publishConfig',
  'repository',
  'scripts',
  'sideEffects',
  'types',
  'version',
];

const ROOT_PATH = resolve(__dirname, '..');
const packageJSONTemplatePath = join('templates', 'package.hbs.json');
const packageJSONTemplate = readJSONSync(
  join(ROOT_PATH, packageJSONTemplatePath),
);

// eslint-disable-next-line jest/valid-describe
describe(packageJSONTemplatePath, () => {
  it('has only known keys', () => {
    const keys = Object.keys(packageJSONTemplate).sort();

    // Template keys should match exactly. If updating it, remember to update tests!
    expect(keys).toStrictEqual(KNOWN_TEMPLATE_KEYS);
  });
});

readPackages().forEach(({packageName, packageJSON, packageJSONPath}) => {
  // eslint-disable-next-line jest/valid-describe
  describe(packageJSONPath, () => {
    it('specifies Shopify as author', () => {
      expect(packageJSON.author).toBe(packageJSONTemplate.author);
    });

    it('specifies Quilt Issues as bugs URL', () => {
      expect(packageJSON.bugs).toStrictEqual(packageJSONTemplate.bugs);
    });

    it('specifies dependencies', () => {
      expect(packageJSON.dependencies).not.toStrictEqual({});
    });

    it('specifies a description', () => {
      expect(packageJSON.description).not.toBeUndefined();
    });

    it('specifies publishable files', () => {
      if(packageName == 'polyfills') return; // FIXME

      expect(packageJSON.files).toContain('dist/*');
      expect(packageJSON.files).toContain('!tsconfig.tsbuildinfo');
    });

    it('specifies Quilt deep-link homepage', () => {
      const expectedHomepage = compile(packageJSONTemplate.homepage);

      expect(packageJSON.homepage).toBe(expectedHomepage);
    });

    it('specifies the MIT license', () => {
      expect(packageJSON.license).toBe(packageJSONTemplate.license);
    });

    it('specifies the expected main', () => {
      if(packageName === 'graphql-persisted') return; // FIXME: Address this in graphql-persisted

      expect(packageJSON.main).toBe(packageJSONTemplate.main);
    });

    it('specifies name matching scope and path', () => {
      const expectedName = compile(packageJSONTemplate.name);

      expect(packageJSON.name).toBe(expectedName);
    });

    it('specifies Shopify‘s public publishConfig', () => {
      expect(packageJSON.publishConfig).toStrictEqual(
        packageJSONTemplate.publishConfig,
      );
    });

    it('specifies a repository deep-linking into the Quilt monorepo', () => {
      const expectedRepository = {
        ...packageJSONTemplate.repository,
        directory: compile(packageJSONTemplate.repository.directory),
      };

      expect(packageJSON.repository).toStrictEqual(expectedRepository);
    });

    it('specifies scripts, including build', () => {
      expect(packageJSON.scripts.build).toBe(packageJSONTemplate.scripts.build);
    });

    it('specifies if it has sideEffects', () => {
      const exceptions = ['csrf-token-fetcher', 'dates', 'react-effect', 'react-google-analytics', 'useful-types']
      if (exceptions.includes(packageName)) return; // FIXME

      expect(packageJSON.sideEffects).toBe(Boolean(packageJSON.sideEffects));
    });

    it('specifies the expected types', () => {
      if(packageName === 'graphql-persisted') return; // FIXME

      expect(packageJSON.types).toBe(packageJSONTemplate.types);
    });

    it('specifies a version', () => {
      expect(packageJSON.version).not.toBeUndefined();
    });
  });

  function compile(string) {
    return string.replace('{{name}}', packageName);
  }
});

function readPackages() {
  const packagesPath = join(ROOT_PATH, 'packages');

  return glob
    .sync(join(packagesPath, '*', 'package.json'))
    .map(absolutePackageJSONPath => {
      return {
        packageName: dirname(relative(packagesPath, absolutePackageJSONPath)),
        packageJSON: readJSONSync(absolutePackageJSONPath),
        packageJSONPath: relative(ROOT_PATH, absolutePackageJSONPath),
      };
    });
}
