---
---
(function() {

  // initialize

  var index = lunr(function () {
    this.field('title', {boost: 10})
    this.field('category')
    this.field('tags', {boost: 2})
    this.field('body')
    this.ref('url')
  });

  var store = new lunr.Store();

  index.on('add', function(obj, index) {
    store.set(obj.url, obj);
  })

  // load data and add to index

  $.get('{{ site.github.url }}/json/articles.json', function(data) {
    data.forEach(function(obj) {
      index.add(obj);
    });
    $(document).trigger('searchready', [index, store]);
  });

  $(document).ready(function() {

    // configure keys

    var shouldTriggerSearch = function(e) {
      var code = e.which;

      return !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey && (code >= 65 && code <= 90 /* a-zA-Z */ ||
        code >= 48 && code <= 57 /* 0-9 */ ||
        code == 191 /* '/' */);
    };
    var searchField = $('.ui.search input.prompt');
    $(document).on('keydown', function(e) {
      if (!searchField.is(':focus')) {
        if (shouldTriggerSearch(e)) {
          searchField.focus();

          if (e.which == 191) {
            e.preventDefault();
            searchField.select();
          }
        }
      } else {
        if (e.which == 13 && searchField.val()) {
          location.href = '{{ site.github.url }}/search/?q=' + searchField.val();
        }
      }
    });

    // setup the search field

    var maxResults = 10;

    $('.ui.search').search({
      transition: 'slide',
      duration: 100,
      maxResults: maxResults,
      apiSettings: {
        mockResponse: function() {
          var query = $(this).search('get value');
          var result = index.search(query);
          var results = [];
          for (var item in result) {

            if (results.length == maxResults) {
              // Add 'See more results' and break
              results[maxResults-1] = {
                title: '<span style="color:grey; font-weight:normal;">See more results</span>',
                url: '{{ site.github.url }}/search/?q=' + query
              };
              break;
            }

            var ref = result[item].ref;
            var rec = store.get(ref);
            results.push(rec);
          }
          return {
            results: results
          };
        }
      },
      onSelect: function(result) {
        location.href = result.url;
      }
    });
  });
})()
