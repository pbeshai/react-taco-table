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
});
