import * as Formatters from '../src/Formatters';

describe('Formatters', function () {
  const identity = d => d;
  describe('safeFormat', function () {
    it('should return null when passed a null', function () {
      assert.equal(Formatters.safeFormat(null, identity), null);
    });

    it('should return undefined when passed a undefined', function () {
      assert.equal(Formatters.safeFormat(undefined, identity), undefined);
    });

    it('should return a formatted value when passed a value that is safe', function () {
      assert.equal(Formatters.safeFormat(5, identity), 5);
    });
  });

  describe('zeroAsNull', function () {
    const zeroAsNullInstance = Formatters.zeroAsNull(identity);
    it('should return a formatted null when passed a zero', function () {
      assert.equal(zeroAsNullInstance(0), null);
    });

    it('should return a formatted normal value', function () {
      assert.equal(zeroAsNullInstance(1), 1);
    });
  });

  describe('makePlusMinus', function () {
    const makePlusMinusInstance = Formatters.makePlusMinus(identity);

    it('should add a + to a formatted positive value', function () {
      assert.equal(makePlusMinusInstance(3), '+3');
    });

    it('should keep a - for a formatted negative value', function () {
      assert.equal(makePlusMinusInstance(-2), '-2');
    });
  });

  describe('commaFormat', function () {
    it('should format numbers < 1000 normally', function () {
      assert.equal(Formatters.commaFormat(999), '999');
    });

    it('should format numbers > 1000 with commas', function () {
      assert.equal(Formatters.commaFormat(9999999), '9,999,999');
    });

    it('should not affect modest number of decimals', function () {
      assert.equal(Formatters.commaFormat(999.999999), '999.999999');
      assert.equal(Formatters.commaFormat(9999999.99), '9,999,999.99');
      assert.equal(Formatters.commaFormat(9999999.9999), '9,999,999.9999');
      assert.equal(Formatters.commaFormat(9999999.999999), '10,000,000');
    });
  });
});
