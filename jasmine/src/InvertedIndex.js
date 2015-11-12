// Inverted Index Checkpoint.
// Gertrude Nyenyeshi

// Initialize the Index.
var Index;
(function() {
  'use strict';
  // Index constructor function.
  Index = function() {
    // Index object.
    this.index = {};
    // Unique terms to be omitted when creating index.
    this.unique = ['in', 'a', 'and', 'an', 'is', 'the'];
  };

  // Inherited properties of Index constructor function.
  Index.prototype = {
    // CreateIndex creates an index from the json file.Takes the location of the json file as its argument.
    createIndex: function(filepath) {

      // Returns data read from JSON file. Alternative to this is the xmlHttpRequest object used in Ajax calls.
      return $.getJSON(filepath);
    },

    // GetIndex populates the index object.
    getIndex: function(jsonFile) {
      var obj = this;
      // Variables to be used in this function.
      var empty = [];
      var newObj = {};

      // Callback function to be used in first forEach loop.
      function populate(element, index, array) {
        // Concat the title and text, get rid of punctuation, convert to lower case, split, sort and store them in an array
        var j = (jsonFile[index].title + ' ' + jsonFile[index].text).replace(/[,?."'\/\\]/g, '').toLowerCase().split(' ').sort();
        obj.index[index] = j;
      }
      jsonFile.forEach(populate);

      // Callback function to be used in second forEach loop.
      function remove(element, index, array) {
        if ((obj.unique).indexOf(element) === -1) {
          empty.push(element);
          newObj[key] = empty;
        }
      }

      // Loop through the populated index and do forEach on the value of each key.
      for (var key in obj.index) {
        this.index[key].forEach(remove);
        empty = [];
      }
      this.index = newObj;
      return this.index;
    },

    searchIndex: function(item) {
      var terms = [];
      var results = [];
      var arr = [];
      // Error to be thrown.
      var err = new Error('Should be a string');
      // If search parameter is an Array.
      if (Array.isArray(item)) {
        terms = item[0].split(' ');
        if (item.length > 0) {
          terms = item;
        }
      } else {
        // Else, the parameter(s) is/are expected to be a string.
        for (var i = 0; i < arguments.length; i++) {
          if (/\d/.test(arguments[i])) {
            throw err;
          } else {
            terms.push(arguments[i]);
          }
        }
      }
      // For each search term loop through the object key property (an array) and return the key that term is found in.
      for (var j = 0; j < terms.length; j++) {
        for (var key in this.index) {
          // Convert the search term to lower case and omit any punctuation marks.
          if (this.index[key].indexOf(terms[j].toLowerCase().replace(/[,?."'\/\\]/g, '')) !== -1) {
            results.push(key);
          }
        }
        // If search term was found and object indices were pushed into the results array, push it to the arr array to be returned.
        if (results.length > 0) {
          arr.push(results);
        } else {
          // If term is not found in the index.
          arr.push(['Not Found']);
        }
        // Empty results array after every loop.
        results = [];
      }
      return arr;
    }
  };
})();
