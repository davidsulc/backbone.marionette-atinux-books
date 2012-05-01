MyApp.LibraryApp = function(){
  var LibraryApp = {};
  
  var Layout = Backbone.Marionette.Layout.extend({
    template: "#library-layout",
    
    regions: {
      search: "#searchBar",
      books: "#bookContainer"
    }
  });
  
  LibraryApp.initializeLayout = function(){
    LibraryApp.layout = new Layout();

    LibraryApp.layout.on("show", function(){
      MyApp.vent.trigger("layout:rendered");
    });
    MyApp.content.show(MyApp.LibraryApp.layout);
  };
  
  return LibraryApp;
}();

MyApp.addInitializer(function(){
  MyApp.LibraryApp.initializeLayout();
});
