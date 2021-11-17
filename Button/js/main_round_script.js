/*
*  Here goes the main round code
*/

var message_duration = 3; //Message duration for win and fail messages in seconds

//This function constructs the experimental screen

function experiment_frame(){
   $('body').html($('<div>', {
      'id': 'header',
   }));
   $('#header').html($('<div>', {
      'id': 'message_area',
   }));

   // initialize button area
   $('body').append($('<div>', {
      'id': 'button_section',
   }));
   $('#button_section').append($('<div>', {
      'id': 'button_area'
   }));

   // intialize buttons
   $('#button_area').append($('<div>', {
      'id': 'button_frame',
      'class': 'arm_frames'
   }));

   $('#button_frame').append($('<img>', {
      'src': button_folder_path + 'button_' + button.button_order[button.current_button] + '.jpg',
      'id': 'button',
      'class': 'arm_img' 
   }));

   // animating arms when mouse is hovering over them
   $('.arm_img').hover( function() {
      $(this).toggleClass('highlighted_arm_img');
   });

   // intialize info
   $('#button_section').append($('<div>', {
      'id': 'info_area',
   }));
   $('#info_area').append($('<div>', {
      'html': button_press_message(button.presses, button.wins),
      'id': 'current_button_info',
      'class': 'info_message'
   }));
   $('#info_area').append($('<div>', {
      'html': 'You have a total of <b>' + number_of_presses +'</b> presses remaining',
      'id': 'presses_info',
      'class': 'info_message'
   }));

   // initialize the next button
   $('body').append($('<div>', {
      'id': 'next_button_frame',
   }));

   $('#next_button_frame').append($('<button>', {
      'type': 'button',
      'id': 'next_button',
      'html': 'Give me a new button to press!',
   }));
};

//These functions wait for current button or next button clicks and does all the related procedures 

var message_remove = 0;

function flash_message(message){
   clearTimeout(message_remove);

   $('#message_area').html($('<div>', {
      'id': 'flash_message'
   }));
   $('#flash_message').html($('<span>', {
      'html': message,
   }));


   message_remove = setTimeout(function(){
      $('#message_area').html('');
   }, message_duration*1000);
}

function driver(exit_step){
   $('#next_button').attr('onclick', 'button.new_button();$(\'#message_area\').html(\'\');');
   // choice is made when an arm is clicked on
   $('.arm_img').off('click');
   $('.arm_img').click(function() {
      var armID = this.getAttribute('id');
      if(armID == 'button'){
         var button_outcome = button.press_button();
         experimental_data.record_press(button_outcome);
         if(button_outcome){
            flash_message(after_press_win_message);
            counter.count_win();
         }
         else{
            flash_message(after_press_fail_message);
            counter.count_fail();
         }
         button.update_button_info();
         counter.update_counter();
      }
      if(counter.remaining_presses == 0) exit_step();
   })
};

function experimental_run(){
   button.reshuffle_buttons();
   experimental_data.new_round();
   experiment_frame();

   $('#message_area').html('');
   
   $('#message_area').html($('<div>', {
      'id': 'tutorial_message'
   }));

   $('#tutorial_message').html($('<span>', {
      'html': experimental_round_message,
   }))

   counter.new_counter(number_of_presses);
   $('#next_button').attr('onclick', 'button.new_button()');
   driver(debrief_screen);
   experimental_data.start_timer();

   message_remove = setTimeout(function(){
      $('#message_area').html('');
   }, message_duration*1000);
}