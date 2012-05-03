MyApp.LibraryApp = function(){
  var LibraryApp = {};
  
  var Layout = Backbone.Marionette.Layout.extend({
    template: "#library-layout",
    
    regions: {
      search: "#searchBar",
      books: "#bookContainer"
    }
  });
  
  var Book = Backbone.Model.extend();

  var Books = Backbone.Collection.extend({
    model: Book,
    
    initialize: function(){
      var self = this;
      _.bindAll(this, "search", "moreBooks");
      MyApp.vent.on("search:term", function(term){ self.search(term); });
      MyApp.vent.on("search:more", function(){ self.moreBooks(); });
      
      // the number of books we fetch each time
      this.maxResults = 40;
      // the results "page" we last fetched
      this.page = 0;
      
      // flags whether the collection is currently in the process of fetching
      // more results from the API (to avoid multiple simultaneous calls
      this.loading = false;
      
      // remember the previous search
      this.previousSearch = null;
      // the maximum number of results for the previous search
      this.totalItems = null;
    },
    
    search: function(searchTerm){
      this.page = 0;
      
      var self = this;
      this.fetchBooks(searchTerm, function(books){
        if(books.length < 1){
          MyApp.vent.trigger("search:noResults");
        }
        else{
          self.reset(books);
        }
      });
      
      this.previousSearch = searchTerm;
    },
    
    moreBooks: function(){
      // if we've loaded all the books for this search, there are no more to load !
      if(this.length >= this.totalItems){
        return true;
      }
      
      var self = this;
      this.fetchBooks(this.previousSearch, function(books){ self.add(books); });
    },
    
    fetchBooks: function(searchTerm, callback){
      if(this.loading) return true;

      this.loading = true;
      
      var self = this;
      MyApp.vent.trigger("search:start");
      
      var query = encodeURIComponent(searchTerm)+'&maxResults='+this.maxResults+'&startIndex='+(this.page * this.maxResults)+'&fields=totalItems,items(id,volumeInfo/title,volumeInfo/subtitle,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/description,volumeInfo/imageLinks)';
      
      $.ajax({
        url: 'https://www.googleapis.com/books/v1/volumes',
        dataType: 'jsonp',
        data: 'q='+query,
        success: function (res) {
          MyApp.vent.trigger("search:stop");
          if(res.totalItems == 0){
            callback([]);
            return [];
          }
          if(res.items){
            self.page++;
            self.totalItems = res.totalItems;
            var searchResults = [];
            _.each(res.items, function(item){
              var thumbnail = null;
              if(item.volumeInfo && item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail){
                thumbnail = item.volumeInfo.imageLinks.thumbnail;
              }
              searchResults[searchResults.length] = new Book({
                thumbnail: thumbnail,
                title: item.volumeInfo.title,
                subtitle: item.volumeInfo.subtitle,
                description: item.volumeInfo.description,
                googleId: item.id
              });
            });
            callback(searchResults);
            self.loading = false;
            return searchResults;
          }
          else if (res.error) {
            MyApp.vent.trigger("search:error");
            self.loading = false;
          }
        }
      });
    }
  });
  
  LibraryApp.Books = new Books();
  
  LibraryApp.initializeLayout = function(){
    LibraryApp.layout = new Layout();

    LibraryApp.layout.on("show", function(){
      MyApp.vent.trigger("layout:rendered");
    });
    MyApp.content.show(MyApp.LibraryApp.layout);
  };
  
  LibraryApp.search = function(term){
    LibraryApp.initializeLayout();
    MyApp.LibraryApp.BookList.showBooks(LibraryApp.Books);
    
    MyApp.vent.trigger("search:term", term);
  };
  
  LibraryApp.defaultSearch = function(){
    LibraryApp.search(LibraryApp.Books.previousSearch || "Neuromarketing");
  };
  
  return LibraryApp;
}();
