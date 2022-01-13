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

    //Creates new item elements
    const createNewItem = function(query) {
      const $newItem = $(`
      <li class="item">
      <input type="checkbox">
      <span>${escape(query.item)}
      <button type="submit" class="delete" queryid="${query.id}>
      <i class="far fa-trash-alt"></i>
        </button>
        </span>
        <img>
        </li>`);
      return $newItem;
    };

    //Loads items into the html document
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

    const renderItems = (list) => {
      // $allItems = $('.item');
      $eating = $('.food');
      $reading = $('.books');
      $watching = $('.film');
      $buying = $('.products');
      $othering = $('.custom-list');
      //reloads the category box
      // $allItems.empty();
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

    //Gets value for input and sends to /requests - event listener
    $("#search-icon").on('click', function(event) {
      event.preventDefault();
      const newData = { item: $value.val() };
      // let data = $value.val();
      console.log("user input:", newData);
      if ($value.val().length > 0) {
        $.ajax({
          method: "POST",
          url: "/api/requests",
          data: newData,
          success: function() {
            console.log("inside ajax:", newData);
          }
        })
          .then(loadItems);
        $("#search").val('');
      } else {
        console.log("You need to input something!");
      }
    });

    $(".item").on("click", ".delete", function(event) {
      event.preventDefault();
      const data = loadItems();

      $.ajax({
        method: "DELETE",
        url: `/api/requests/${$(this).attr("queryid")}`,
        data: data,

        success: function() {
          loadItems();
        },
        error: function(err) {
          console.log("error:", err);
        },
      });
    });
  });

  //strikethrough
  $('.custom-list').change(function() {
    if ($('.custom-list').prop('checked') ) {
      $('#value').css('text-decoration','line-through');
    }
  });



})(jQuery);

document.addEventListener('DOMContentLoaded', (event) => {
  //Changes the opacity of the item when it has been dragged
  function handleDragStart(event) {
    this.style.opacity = '0.3';

    dragSrcEl = this;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.innerHTML);
  }

  //Keeps the opacity 1 for the dragged item
  function handleDragEnd(event) {
    this.style.opacity = '1';
  }

  //While item is being dragged
  function handleDragOver(event) {
    if(event.preventDefault) {
      event.preventDefault();
    }
    return false;
  }

  function handleDrop(event) {
    event.stopPropogation();
    return false;
  }



  let items = document.querySelectorAll('.item');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
  })

})
