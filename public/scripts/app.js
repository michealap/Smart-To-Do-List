
// Client facing scripts here
(function($) {
  $(document).ready(() => {
    //Value for input
    const $value = $("#search");
    
    //Prevent cross site scripting attacks
    const escape = function(str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };
    $(function() {
      $(".sortable").draggable({
        accept: ".item"

      });
      console.log("here in sortable");
      $(".sortable").droppable({
        accept: ".item",
        classes: {
          "ui-droppable": "highlight"
        }
      });
    });
    
    //Creates new item elements
    const createNewItem = function(query) {
      const $newItem = $(`
      <li class="item">
      <span>
      <input type="checkbox" id="item" name="to-do">
      <label for="to-do">${escape(query.item)}</label>
      <button type="submit" class="delete" id="${query.id}">
      <i class="far fa-trash-alt"></i>
      </button>
      </span>
      </li>`);
      return $newItem;
    };
    
    //global
    const $eating = $('#food');
    const $reading = $('#book');
    const $watching = $('#film');
    const $buying = $('#product');
    const $othering = $('#other');
    
    //Loads items into the html document
    const loadItems = () => {
      //reloads the category box
      $eating.empty();
      $reading.empty();
      $watching.empty();
      $buying.empty();
      $othering.empty();
      $.ajax({
        method: "GET",
        url: "/api/requests",
        success: (data) => {
          for (let list of data) {
            renderItems(list);
          }
        },
      });
    };
    loadItems();

    $("ul").on("click", ".delete", function(event) {
      event.preventDefault();
      const id = $(this).attr('id');
      console.log("id on click:", id);

      $.ajax({
        method: "POST",
        url: "/api/requests/delete",
        data: {id},
        success: function() {
          loadItems();
        },
        error: function(err) {
          console.log("error:", err);
        },
      });
    });

    const renderItems = (list) => {
      for (let item of list) {
        console.log("item inside render", item);
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
    
    //Gets value for input and sends to /requests - event listener
    $("#search-icon").on('click', function(event) {
      event.preventDefault();
      const newData = { item: $value.val() };
      if ($value.val().length > 0) {
        $.ajax({
          method: "POST",
          url: "/api/requests",
          data: newData,
          success: function() {
            loadItems();
          }
        });
        $("#search").val('');
      } else {
        console.log("You need to input something!");
      }
    });
  });

  
  
})(jQuery);