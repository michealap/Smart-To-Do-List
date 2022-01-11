// Client facing scripts here
(function($) {
  $(document).ready(() => {
    $("#search").on('input', onInput);
    $("#search-form").on('submit', onSubmit);
   
  });
  const onInput = function(event) {
    let $input = $('#search');
    console.log("you have reached here:", $input);
  };
  // here are my named functions
    
  const onSubmit = function(event) {
    event.preventDefault();
    let $form = $(this);
    let $input = $form.find('input');
    console.log("you have submitted:", $input);
  };
  // let formData = $form.serialize();
  // $.post("/requests", formData)
  //   .then(function(response) {
  //     console.log("inside promise");
  //   });
  //you can define a function outside of document.ready
})(jQuery);
