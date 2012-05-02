MyApp.LibraryApp.BookList = function(){
  var BookList = {};

  var BookView = Backbone.Marionette.ItemView.extend({
    template: "#book-template"
  });

  var BookListView = Backbone.Marionette.CompositeView.extend({
    template: "#book-list-template",
    id: "bookList",
    itemView: BookView,
    
    appendHtml: function(collectionView, itemView){
      collectionView.$(".books").append(itemView.el);
    }
  });
  
  BookList.showBooks = function(books){
    var bookListView = new BookListView({ collection: books });
    MyApp.LibraryApp.layout.books.show(bookListView);
  };
  
  return BookList;
}();
  
MyApp.vent.on("layout:rendered", function(){
  MyApp.LibraryApp.BookList.showBooks(MyApp.LibraryApp.Books);
});
