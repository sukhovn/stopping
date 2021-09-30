/*
*  Here we define main experiment parameters
*/

var number_of_presses = 20;
var number_of_after_press_messages = 5; //Number of times after press message is flashed out

var loading_screen_description = "This is some loading screen description, press enter to continue";
var experimental_prompt = "This is experimental description";
var finishing_screen_description = "Thank you for the experiment!";

var button_folder_path = "pictures/square_buttons/"
var after_press_win_message = "Congratulations, after pressing the button you got 1 point!"
var after_press_fail_message = "Unfortunately, after pressing the button you get nothing."
var after_press_message_instruction = "Now you have a choice, you can either continue pressing the same button and observe the outcome,<br>\
                        alternatively you can make the decision to move to the next button. Press enter to continue."

/*
*  Here goes the main experimental code
*  Here we define main experimental classes
*/

//This object generates button presses outcomes and updates button pictures and counter

var button = (function(){
   core = {};

   core.current_p = Math.random();
   core.presses = 0;
   core.wins = 0;

   core.number_of_buttons = 10;
   core.current_button = 0;

   core.new_button = function(){
      this.current_p = Math.random();      
      this.presses = 0;
      this.wins = 0;

      do{
         var random_number = Math.floor(this.number_of_buttons*Math.random());
      }
      while(random_number == this.current_button);
      this.current_button = random_number;
   };

   core.update_button = function(){
      $("#current_presses_info").html("<div>Current button presses: " + this.presses + "</div>");
      $("#current_wins_info").html("<div>Current button wins: " + this.wins + "</div>");
      $('#button').attr("src", button_folder_path + 'button_' + this.current_button + '.jpg');
   };

   core.press_button = function(){
      this.presses++;
      if(Math.random() < this.current_p){
         core.wins++;
         return 1;
      }
      else{
         return 0;
      }
   };

   return core;
})();

//This object handles overall counter
var counter = {
   remaining_presses: number_of_presses,
   wins: 0,

   update_counter: function(){
      $("#presses_info").html("<div>Remaining presses: " + this.remaining_presses + "</div>");
      $("#wins_info").html("<div>Total win: " + this.wins + "</div>");
   },

   count_win: function(){
      this.remaining_presses--;
      this.wins++;
   },

   count_fail: function(){
      this.remaining_presses--;
   }
};

/*
*  Here goes the loading screen code
*/ 

function loading_screen(){
   $('body').html('<p>' + loading_screen_description + '</p>');

   $(document).keyup(function(event) {
      if(event.which === 13) {
         experimental_screen();
      }
   });
};

/*
*  Here goes the testing screen code
*/

function single_button_frame(){
   // appending button info section
   $('#button_section').html($('<div>', {
      "id": 'current_button_info'
   }));

   $("#current_button_info").append($('<div>', {
      "html": '<div>Current button presses:</div>',
      "id": 'current_presses_info'
   }));
   $("#current_button_info").append($('<div>', {
      "html": '<div>Current button wins:</div>',
      "id": 'current_wins_info'
   }));

   // appending button area
   $('#button_section').append($('<div>', {
      "id": 'button_area'
   }));

   // intialize buttons
   $('#button_area').html('<div id="button_frame"></div>');

   $('#button_frame').append($('<div>', {
      "html": "This is button",
      "class": "arm_labels"
   }));
   $('#button_frame').append($('<img>', {
      "src": button_folder_path + "button_0.jpg",
      "id": "button",
      "class": "arm_img" 
   }));

   // animating arms when mouse is hovering over them
   $('.arm_img').hover( function() {
      $(this).toggleClass("highlighted_arm_img");
   });
}

function two_button_frame(){
   // appending button info section
   $('#button_section').html($('<div>', {
      "id": 'current_button_info'
   }));

   $("#current_button_info").append($('<div>', {
      "html": '<div>Current button presses:</div>',
      "id": 'current_presses_info'
   }));
   $("#current_button_info").append($('<div>', {
      "html": '<div>Current button wins:</div>',
      "id": 'current_wins_info'
   }));

   // appending button area
   $('#button_section').append($('<div>', {
      "id": 'button_area'
   }));

   // intialize grid
   var gridHTML='';
   gridHTML += '<tr>';
   gridHTML += '<td align="center" class="arm_frames"><div id="button_frame"></div></td>';
   gridHTML += '<td align="center" class="arm_frames"><div id="arrow_frame"></div></td>';
   gridHTML += '</tr>';

   // append grid HTML at grid div
   $('#button_area').html(gridHTML);

   $('#button_frame').append($('<div>', {
      "html": "This is button",
      "class": "arm_labels"
   }));
   $('#button_frame').append($('<img>', {
      "src": button_folder_path + "button_0.jpg",
      "id": "button",
      "class": "arm_img" 
   }));

   $('#arrow_frame').append($('<div>', {
      "html": "Next button",
      "class": "arm_labels"
   }));
   $('#arrow_frame').append($('<img>', {
      "src": "pictures/white_arrow.jpeg",
      "id": "arrow",
      "class": "arm_img" 
   }));

   // animating arms when mouse is hovering over them
   $('.arm_img').hover( function() {
      $(this).toggleClass("highlighted_arm_img");
   });
}

function after_press_message(outcome){
   // appending button info section
   $('#button_section').html($('<div>', {
      "id": 'after_press_message'
   }));

   if(outcome){
      $('#after_press_message').append($('<div>', {
         "html": '<div>' + after_press_win_message + '<br>\
                        Your total result after using this button is:</div>',
         "height": "80px"
      }));
   }
   else{
      $('#after_press_message').append($('<div>', {
         "html": '<div>' + after_press_fail_message + '<br>\
                        Your total result after using this button is:</div>',
         "height": "80px"
      }));
   }
   $("#after_press_message").append($('<div>', {
      "html": '<div>Current button presses:</div>',
      "id": 'current_presses_info',
      "height": '50px'
   }));
   $("#after_press_message").append($('<div>', {
      "html": '<div>Current button wins:</div>',
      "id": 'current_wins_info',
      "height": "50px"
   }));
   $('#after_press_message').append($('<div>', {
         "html": '<div>' + after_press_message_instruction + '</div>',
   }));

   button.update_button();

   $(document).keyup(function(event) {
      if(event.which === 13) {
         two_button_frame();
         button.update_button();
         driver();
      }
   });
}

function experiment_frame(){
   $('body').html('');
   // header part
   $('body').append($('<div>', {
      "id": 'header'
   }));

   $("#header").append($('<div>', {
      "html": '<div>Remaining presses:</div>',
      "id": 'presses_info'
   }));
   $("#header").append($('<div>', {
      "html": '<div>Total win:</div>',
      "id": 'wins_info'
   }));

   // current button info part
   $('body').append($('<div>', {
      "id": 'button_section'
   }))
    
   single_button_frame();
   
   // appending footer, below the screen part with the bandits
   $('body').append($('<div>', {
      "id": 'footer'
   }));

   // prompt

   $("#footer").append($('<div>', {
      "html": experimental_prompt,
      "id": 'prompt'
   }));
};

function driver(){
   // choice is made when an arm is clicked on
   $(document).off('keyup');
   $('.arm_img').click(function() {
      var armID = this.getAttribute('id');
      if(armID == "button"){
         var button_outcome = button.press_button();
         if(button_outcome) counter.count_win();
         else counter.count_fail();
      }
      if(armID == "arrow"){
         button.new_button();
      }
      counter.update_counter();
      button.update_button();
      if(counter.remaining_presses == 0) finishing_screen();
      if(armID == "button" && number_of_after_press_messages > 0){
         number_of_after_press_messages--;
         after_press_message(button_outcome);
      }
   })
}


function experimental_screen(){
   experiment_frame();
   counter.update_counter();
   button.update_button();

   driver();
};

/*
*  Here goes the finishing screen code
*/

function finishing_screen(){
   $(document).off('keyup');
   $('body').html('<p>' + finishing_screen_description + '</p>');
};

/*
*  Here goes the script that runs the experiment
*/

function run_experiment(){
   loading_screen();
}