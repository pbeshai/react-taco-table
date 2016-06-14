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

    it('should return value when passed a value that is safe', function () {
      assert.equal(Formatters.safeFormat(5, identity), 5);
    });
  });
});
