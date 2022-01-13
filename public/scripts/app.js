
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
      <input type="checkbox" class="checkbox">
      <span class="span">${escape(query.item)}
      <button type="submit" class="delete" id="${query.id}">
      <i class="far fa-trash-alt"></i>
      </button>
      </span>
      <img>
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
      console.log("i am here in load items");
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

    $("li").on("click", ".delete", function(event) {
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

    //Micheala - checkout this possible solution for line-through
    $("#checkbox").on("click", function(event) {
      $value = this;
      $value.sibling("#span").css("text-decoration", "line-through")
    })

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

  //strikethrough - added feature
  $('li').change(function() {
    if ($('li').prop('checked')) {
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
