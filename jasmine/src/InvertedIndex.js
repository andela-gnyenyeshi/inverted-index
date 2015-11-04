//Inverted Index Checkpoint.
//Gertrude Nyenyeshi
"use strict";
//Index constructor function.
function Index() {
  //reference to itself due to scoping. 'this' may refer to global window object in any function
  obj = this;
  //Index object
  obj.index = {};
  //unique terms to be omitted when creating index.
  obj.unique = ["in", "a", "and", "an", "is", "the"];
}

//Inherited properties of Index constructor function
Index.prototype = {
  //createIndex creates an index from the json file.Takes the location of the json file as its argument.
  createIndex: function(filepath) {

    //returns data read from JSON file. Alternative to this is the xmlHttpRequest object used in Ajaax calls.
    return $.getJSON(filepath); 
  },

  //getIndex populates the index object.
  getIndex: function(jsonFile) {
    //variables to be used in this function
    var empty = [];
    var newObj = {};

    //callback function to be used in first forEach loop
    function populate(element, index, array) {
      //Concat the title and text, get rid of punctuation, convert to lower case, split, sort and store them in an array
      var j =  (jsonFile[index].title + " " + jsonFile[index].text).replace(/[,?."'\/\\]/g, '').toLowerCase().split(" ").sort();
      obj.index[index] = j;
    }
    jsonFile.forEach(populate);

    //callback function to be used in second forEach loop 
    function remove(element, index, array) {
      if ((obj.unique).indexOf(element) == -1) {
        empty.push(element);
        newObj[key] = empty;
      }
    }

    //Loop through the populated index and do forEach on the value of each key.
    for (var key in obj.index) {
      obj.index[key].forEach(remove);
      empty = [];
    }
    obj.index = newObj;
    return obj.index;
  },

  searchIndex: function() {
    var terms = [];
    var results = [];
    var arr = [];
    //Error to be thrown
    var err = new Error("Should be a string");
    for (var i = 0; i < arguments.length; i++) {
      //if argument is of length one and of type Array
      if (arguments.length == 1 && Array.isArray(arguments[0])) {
        //if the array already contains split elements
        if (arguments[0].length > 1) {
          terms = arguments[0];
          //if not, split the string to elements
        } else if (arguments[0].length == 1) {
          terms = arguments[0][0].split(" ");
        } else {
          //if array is empty assign terms to empty string
          terms = [""];
        }
      }
      //if argument is a number, throw an error
      if (arguments.length == 1 && typeof arguments[0] == 'number') {
        throw err;
      }
      //if argument is of length one and of type String, split it into elements
      if (arguments.length == 1 && typeof arguments[0] == 'string') {
        terms = (arguments[0].split(" "));
      }
      //if function receives more than one parameter
      if (arguments.length > 1) {
        //loop through them and identify their type while pushing to terms array
        for (var i = 0; i < arguments.length; i++) {
          if (typeof arguments[i] == 'string') {
            terms.push(arguments[i]);
          } else {
            //if typeof parameter is a number throw an error
            throw err;
          }
        }
      }
      //For each search term loop through the object key property (an array) and return the key that term is found in
      for (var j = 0; j < terms.length; j++) {
        for (var key in obj.index) {
          //convert the search term to lower case and omit any punctuation marks
          if (obj.index[key].indexOf(terms[j].toLowerCase().replace(/[,?."'\/\\]/g, '')) !== -1) {
            results.push(key);
          }
        }
        //if search term was found and object indices were pushed into the results array, push it to the arr array to be returned
        if (results.length > 0) {
          arr.push(results);
        } else {
          //if term is not found in the index
          arr.push(["Not Found"]);
        }
        //empty results array after every loop
        results = [];
      }

      return arr;
    }
  }
};
