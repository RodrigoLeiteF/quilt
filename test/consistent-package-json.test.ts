import {dirname, join, relative, resolve} from 'path';

import {readJSONSync} from 'fs-extra';
import glob from 'glob';

const ROOT_PATH = resolve(__dirname, '..');
const packageJSONTemplatePath = join('templates', 'package.hbs.json');
const packageJSONTemplate = readJSONSync(
  join(ROOT_PATH, packageJSONTemplatePath),
);

readPackages().forEach(({packageName, packageJSON, packageJSONPath}) => {
  // eslint-disable-next-line jest/valid-describe
  describe(packageJSONPath, () => {
    it('specifies name matching scope and path', () => {
      const expectedName = compile(packageJSONTemplate.name);

      expect(packageJSON.name).toBe(expectedName);
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
