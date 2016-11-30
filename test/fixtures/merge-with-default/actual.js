import myLib, { aPackage } from 'my-lib';

const aValue1 = myLib.aPackage('a string');
const aValue2 = aPackage('a string');

export { aValue1, aValue2 };
