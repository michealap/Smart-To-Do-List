
$(document).ready(function() {
  $('#search-form').submit(function(event) {
    event.preventDefault();
    let value = $(this).children('#search').val();
    $.ajax({
      url: '/apicalls',
      type: 'POST',
    })
  })
})

