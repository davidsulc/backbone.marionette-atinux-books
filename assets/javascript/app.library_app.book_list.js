MyApp.LibraryApp.BookList = function(){
  var BookList = {};

  var SearchView = Backbone.View.extend({
    el: "#searchBar",
    
    events: {
      'change #searchTerm': 'search'
    },
    
    search: function() {
      var searchTerm = this.$('#searchTerm').val().trim();
      console.log("searching for ", searchTerm);
    }
  });
  
  MyApp.vent.on("layout:rendered", function(){
    // render a view for the existing HTML in the template, and attach it to the layout (i.e. don't double render)
    var searchView = new SearchView();
    MyApp.LibraryApp.layout.search.attachView(searchView);
  });
  
  return BookList;
}();