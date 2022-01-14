
// Client facing scripts here
(function($) {
  $(document).ready(() => {

    $(".search-box").hide();
    //Value for text input once logged in
    const $value = $("#search");

    //Prevent cross site scripting attacks
    const escape = function(str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };

    const $login = $(".left-side");
    $login.on('click', function(event) {
      event.preventDefault();
      if ($(".login").first().is(":hidden")) {
        $(".login").show("slow");
        $(".search-box").fadeOut("slow");
        $(".todo-box").fadeTo("slow", 0.5);
      } else {
        $(".login").slideUp();
        $(".search-box").fadeIn("slow");
        $(".todo-box").fadeTo("slow", 1);
      }
    });
    
    const $logInForm = $("#login");
    $logInForm.on('submit', function(event) {
      event.preventDefault();
      const data = $(this).serialize();
      $.ajax({
        method: "POST",
        url: "/api/requests/login",
        data: data,
        success: function() {
          $('.login').slideUp();
          loadItems();
          $("#username").text(`Alice`);
          $(".search-box").fadeIn("slow");
          $(".todo-box").fadeTo("slow", 1);
          $("#new").css("display","none");
          $("#new").attr("disabled", true);
          $("#logout").show();
          $("#logout").attr("disabled", false);
        },
        error: function(err) {
          console.log("error:", err);
        },
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
    //loadItems();
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
    
    //append new form to the nav parent and class = right-side
    const $register = $("#new");
    
    $register.on('click', function(event) {
      event.preventDefault();
      if ($(".register").first().is(":hidden")) {
        $(".register").show("slow");
        $(".todo-box").fadeTo("slow", 0.5);
      } else {
        $(".register").slideUp();
        $(".todo-box").fadeTo("slow", 1);
      }
    });

    const $registerForm = $(".register-button");
    $registerForm.on('submit', function(event) {
      event.preventDefault();
      const data = $(this).serialize();
      console.log(data);
      $.ajax({
        method: "POST",
        url: "/",
        data: data,
        success: function() {
          alert("Please login");
          $('#register').slideUp();
        },
        error: function(err) {
          alert("Please fill in registration details");
          console.log("error:", err);
        },
      });
    });
    
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
        $(".error").text("Enter a task");
        $(".error").slideDown("fast", "linear");
        setTimeout(function() {
          $(".error").slideUp("fast", "linear");
        }, 3000);
        console.log("input required");
      }
    });
    
    //event for clciking on trash icon
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
  
  
    const $logout = $("#logout");
    $logout.on('click', function(event) {
      //const $allItems = $("ul");
      event.preventDefault();
      $.ajax({
        method: "POST",
        url: "/api/requests/logout",
        success: function() {
          $("#logout").hide();
          $("#logout").attr("disabled", true);
          $("#new").css("display","block");
          $("#new").attr("disabled", false);
          location.reload();
          alert("You are now logged out");
        },
        error: function(err) {
          console.log("error:", err);
        },
      });
    });
  });
})(jQuery);
