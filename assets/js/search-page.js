function truncate(str, n, useWordBoundary) {
    var singular, tooLong = str.length > n;
    useWordBoundary = useWordBoundary || true;

    // Edge case where someone enters a ridiculously long string.
    str = tooLong ? str.substr(0, n-1) : str;

    singular = (str.search(/\s/) === -1) ? true : false;
    if(!singular) {
      str = useWordBoundary && tooLong ? str.substr(0, str.lastIndexOf(' ')) : str;
    }

    return  tooLong ? str + '&hellip;' : str;
}
$(document).ready(function() {

  var resultdiv = $('.ui.items');
  var q = location.search.split('?q=')[1];

  if (!q) {
    resultdiv.empty();
    var item = `<div class="ui message">No search query specified.</div>`;
    resultdiv.append(item);
    return;
  }

  var title = "Search results for '" + q + "'";

  document.title = document.title.replace('Search results', title);
  $('h1').html(title);
  $('.ui.search input.prompt').val(q);

  $(document).on('searchready', function(e, index, store) {
    resultdiv.empty();

    // search :)
    var result = index.search(q);

    if (result.length) {
      try {
        for (var item in result) {
          var ref = result[item].ref;
          var rec = store.get(ref);
          var item = `<div class="item">
          <div class="content">
            <a class="header" href="`+rec.url+`">`+rec.title+`</a>
            <div class="ui horizontal mini label">
              <a href="`+rec.category_url+`">`+rec.category+`</a>
            </div>
            <div class="description">
              <p>`+truncate(rec.body, 180, true)+`</p>
            </div>
          </div>
      </div>`;
          resultdiv.append(item);
        }
      } catch(e) {
        var item = `<div class="ui negative message">`+e+`</div>`;
        resultdiv.append(item);
      }
    } else {
      var item = `<div class="ui message">Your search returned no results. Try a different search.</div>`;
      resultdiv.append(item);
    }
  }); // searchready

});