MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
  content: "#content"
});

MyApp.vent.on("layout:rendered", function(){
  console.log("layout rendered");
});
