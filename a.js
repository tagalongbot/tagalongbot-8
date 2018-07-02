let practices = await searchPractices({ state_name, city_name, zip_code });

let a = await func({ x });

describe('outer', function() {

  it('first', function() {
    // ...
  });

  describe('inner to be ignored', function() {
    it('again ignore', function() {});
  });

  it('second', function() {
    // ...
  });

});
