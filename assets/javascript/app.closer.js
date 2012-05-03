MyApp.Closer = {};

MyApp.Closer.DefaultView = Backbone.Marionette.ItemView.extend({
  template: "#close-template",
  className: "close"
});

MyApp.Closer.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      "close": "close"
    }
});

MyApp.Closer.close = function(){
  var closeView = new MyApp.Closer.DefaultView();
  MyApp.content.show(closeView);
  Backbone.history.navigate("close");
}

MyApp.addInitializer(function(){
  MyApp.Closer.router = new MyApp.Closer.Router({
    controller: MyApp.Closer
  });
  
  MyApp.vent.trigger("routing:started");
});
