describe("Inverted Index Test", function() {
  "use strict";
  var testIndex = new Index();
  var results;

  beforeEach(function(done) {
    testIndex.createIndex("./books.json").done(function(data) {
      results = data;
      done();
      testIndex.getIndex(results);
    });
  });
  describe("Read Book Data", function() {
    it("Should return true for results.length to be greater than 0", function() {
      expect(results.length).toBeGreaterThan(0);
    });
    it("Should return true for data returned is an Array", function() {
      expect(Array.isArray(results)).toBe(true);
    });
    it("Should confirm each object in JSON array contains a property whose value is a string", function() {
      expect(typeof results[0].title).toBe('string');
      expect(typeof results[1].title).toBe('string');
      expect(typeof results[0].text).toBe('string');
      expect(typeof results[1].text).toBe('string');
    });
  });

  describe("Populate Index", function() {
    it("Should return true for index is not empty", function() {
      expect(Object.keys(testIndex.index).length).toBeGreaterThan(0);
    });
    it("Should return true for index is created after JSON file has been read", function() {
      expect(testIndex.index).not.toBeNull();
    });
    it("Should verify the index maps the string keys to the correct objects in the JSON array", function() {
      expect((testIndex.index[0]).indexOf('alice')).toBe(0);
      expect((testIndex.index[0]).indexOf('bond')).toBe(-1);
      expect((testIndex.index[0]).indexOf('wonderland')).toBe(10);
      expect((testIndex.index[0]).indexOf('rabbit')).toBe(9);
      expect((testIndex.index[1]).indexOf('fellowship')).toBe(4);
      expect((testIndex.index[1]).indexOf('frodo')).toBe(-1);
      expect((testIndex.index[1]).indexOf('dwarf')).toBe(2);
      expect((testIndex.index[0]).indexOf('Thorin')).toBe(-1);
    });
    it("Should return true for lacking words such as 'is', 'the'", function() {
      expect((testIndex.index[0]).indexOf('is')).toBe(-1);
      expect((testIndex.index[0]).indexOf('in')).toBe(-1);
      expect((testIndex.index[0]).indexOf('a')).toBe(-1);
    });
    it("Should return true for index terms being in small case", function() {
      expect(testIndex.index[0][0]).toBe('alice');
      expect(testIndex.index[1][13]).toBe('ring');
    });
  });

  describe("Search Index", function() {
    describe("Should return an array of the indices of the correct objects that contain the words in the search query", function() {
      it("Should return [['0'], ['0'], ['1'], ['0', '1']] for 'alice', 'Wonderland', 'Ring', 'of'", function() {
        expect(testIndex.searchIndex("alice", "Wonderland", "Ring", "of")).toEqual([
          ['0'],
          ['0'],
          ['1'],
          ['0', '1']
        ]);
      });
      it("Should return [['0']] for 'wonderland'", function() {
        expect(testIndex.searchIndex("wonderland")).toEqual([
          ['0']
        ]);
      });
      it("Should accept an array of terms. Should return [['0'], ['0'], ['Not Found']] for '['alice', 'falls', 'rings']", function() {
        expect(testIndex.searchIndex(["alice", "falls", "rings"])).toEqual([
          ['0'],
          ['0'],
          ['Not Found']
        ]);
      });
      it("Should return ['Not Found'] for any term not found in the index", function() {
        expect(testIndex.searchIndex(["Thor"])).toEqual([
          ['Not Found']
        ]);
        expect(testIndex.searchIndex("Hehe", "sheshe")).toEqual([
          ['Not Found'],
          ['Not Found']
        ]);
      });
      it("Should return ['Not Found'] for an empty array and empty string", function() {
        expect(testIndex.searchIndex([])).toEqual([
          ['Not Found']
        ]);
        expect(testIndex.searchIndex("")).toEqual([
          ['Not Found']
        ]);
      });
      it("Should accept a string as an argument", function() {
        expect(testIndex.searchIndex("Alice of, imagination")).toEqual([
          ['0'],
          ['0', '1'],
          ['0']
        ]);
      });
    });

describe('Error handling', function() {
  it("Should throw an error for passing a typeof 'number' argument", function() {
        expect(function() {testIndex.searchIndex(4);}).toThrow(new Error('Should be a string'));
        expect(function() {testIndex.searchIndex("gerty", 4, "alice");}).toThrow(new Error('Should be a string'));
      });
    });
  });
});
