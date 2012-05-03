MyApp.LibraryRouting = function(){
  var LibraryRouting = {};

  LibraryRouting.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      "": "defaultSearch",
      "search/:searchTerm": "search"
    }
  });

  MyApp.vent.on("search:term", function(searchTerm){
    Backbone.history.navigate("search/" + searchTerm);
  });

  MyApp.addInitializer(function(){
    LibraryRouting.router = new LibraryRouting.Router({
      controller: MyApp.LibraryApp
    });
    
    MyApp.vent.trigger("routing:started");
  });

  return LibraryRouting;
}();
