// Client facing scripts here
(function($) {
  $(document).ready(() => {
  //Value for input
    const $value = $("#search");

    //Loades items into the html document
    const loadItems = () => {
      $.ajax({
        method: "GET",
        url: "/api/requests",
        success: (data) => {
          renderItems(data);
        },
      });
    };
    loadItems();

    //Creates new item elements
    const createNewItem = function(query) {
      const newItem = $(`<button type="submit" id=${query.id} class="delete">
    <i class="far fa-trash-alt"></i></button>
    <li>${query.item}
    </li>`);
      return newItem;
    };

    const renderItems = (list) => {
      $eating = $('.food');
      $reading = $('.book');
      $watching = $('.film');
      $buying = $('.products');
      $othering = $('.custom-list');
      //reloads the category box
      $eating.empty();
      $reading.empty();
      $watching.empty();
      $buying.empty();
      $othering.empty();

      for (const item of list) {
        if (item.category === 'food') {
          $eating.append(createNewItem(item));
        } else if (item.category === 'book') {
          $reading.append(createNewItem(item));
        } else if (item.category === 'film') {
          $watching.append(createNewItem(item));
        } else if (item.category === 'product') {
          $buying.append(createNewItem(item));
        } else {
          $othering.append(createNewItem(item));
        }
      }
    };

    //Gets value for input and sends to /requests
    $("#button").on('click', function(event) {
      event.preventDefault();
      const newData = { item: $value.val() };
      // console.log(newData);
      if ($value.val().length > 0) {
        $.ajax({
          method: "POST",
          url: "/api/requests",
          data: newData,
          success: function() {
            loadItems();
            console.log(newData);
            $("#search").val('');
          },
          error: function(error) {
            console.log("Error:", error);
          }
        });
      } else {
        console.log("You need to input something!");
      }
    });



  });

})(jQuery);