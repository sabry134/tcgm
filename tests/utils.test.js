const { expect } = require('chai');
const addNumbers = require('../js/utils');

describe('addNumbers Function', function () {
  it('should return the sum of two numbers', function () {
    expect(addNumbers(2, 3)).to.equal(5);
  });

  it('should handle negative numbers', function () {
    expect(addNumbers(-2, -3)).to.equal(-5);
  });

  it('should return NaN if arguments are not numbers', function () {
    expect(addNumbers('a', 'b')).to.be.NaN;
  });
});