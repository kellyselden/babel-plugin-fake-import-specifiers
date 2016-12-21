import someRandomName, { anotherPackage } from 'my-lib/a-package';

const aValue1 = someRandomName('a string');
const aValue2 = anotherPackage('a string');

export { aValue1, aValue2 };
