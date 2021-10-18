/*
*  Here we define main experiment parameters
*/

var number_of_practice_presses = 10;
var number_of_presses = 20;
var number_of_detailed_instructions = 10;
var subjectID = Math.round(Math.random()*100000000); //Random subject ID

/*
* Here we define attention screen frequency
*/

var attention_check_interval = 10;
var attention_check_results = []; //Tracks the results of attention checks, if the check is passed, the result is 1, else 0

var instruction_screen_description_part1 = '<p style="text-align: left;">&emsp; Welcome to the experiment about decision making. In the beginning of this experiment you will be given a series of buttons.\
                                       When you press a button you either receive a reward or you receive nothing. Each button has a fixed chance of giving a reward,\
                                       for example, one button may give a reward in 9 out of 10 presses on average, another may only give one reward per 10 presses.\
                                       Every button has its own unique chance of giving a reward.  You know that the buttons are distributed uniformly, which means you are equally likely to get a good or a bad button.</p>'
                                    +  '<p>Press ENTER to continue.</p>'
var instruction_screen_description_part2 = '<p style="text-align: left;">&emsp;\
                                       &emsp; You start with a given button and a fixed number of ' + number_of_presses + ' presses. At each point in time you can either press a button\
                                       you currently have or request another one. Moving to the next button has no cost, you can change as many buttons as you want, however, when you move to the next button you can no longer return\
                                       to any of the previous ones. Your goal is to get as many rewards as you can get given the number of presses. Good luck!</p>'
                                    + '<p>Before the main experiment you will be given a practice round with just ' + number_of_practice_presses + ' presses. \
                                       Now press ENTER key to begin with the practice round.</p>';

var after_practice_screen_description = '<p>This was the practice round.</p><p>Now press ENTER key to begin with the experiment.</p>'
var debrief_screen_description = '<p>That\'s it. Thank you for your participation!<br>Please save or write down the following number: ' + 
                                    subjectID + '</p>';

var button_folder_path = 'pictures/square_buttons/';
var next_button_arrow_path = 'pictures/white_arrow.jpeg';
var after_press_win_message = 'Congratulations, after pressing the button you got 1 point!';
var after_press_fail_message = 'Unfortunately, after pressing the button you get nothing.';
var after_press_short_instruction = 'Press ENTER key to continue.';
var after_press_detailed_instruction = 'Now you have a choice: you can either continue pressing this button and observe the outcome.\
                        Alternatively, you can make the decision to move to the next button. Press ENTER key to continue.';

var initial_screen_time; //Records the time the test subject looked at the initial screen

/*
*  Here goes the main experimental code
*  Here we define main experimental classes
*/

//This object generates button presses outcomes and updates button pictures and counter

var button = (function(){
   core = {};

   core.button_number = 0;
   core.current_p = Math.random();
   core.presses = 0;
   core.wins = 0;
   core.last_button_outcome = 0;

   core.number_of_buttons = 10;
   core.current_button = 0;

   core.new_button = function(){
      this.current_p = Math.random();      

      do{
         var random_number = Math.floor(this.number_of_buttons*Math.random());
      }
      while(random_number == this.current_button);
      this.current_button = random_number;

      if(this.presses > 0) this.button_number++;
      this.presses = 0;
      this.wins = 0;
   };

   core.update_button = function(){
      $('#button').attr('src', button_folder_path + 'button_' + this.current_button + '.jpg');
   };

   core.press_button = function(){
      this.presses++;
      if(Math.random() < this.current_p){
         core.wins++;
         this.last_button_outcome = 1;
         return 1;
      }
      else{
         this.last_button_outcome = 0;
         return 0;
      }
   };

   return core;
})();

//This object handles overall counter

var counter = {
   remaining_presses: 0,
   wins: 0,

   new_counter: function(npress){
      this.remaining_presses = npress;
      this.wins = 0;
   },

   count_win: function(){
      this.remaining_presses--;
      this.wins++;
   },

   count_fail: function(){
      this.remaining_presses--;
   }
};

//This object collects and handles experimental data

var experimental_data = {
   data: [],
   time: 0,
   round_number: 0,
   press_number: 0,

   start_timer: function(){
      this.time = (new Date()).getTime();
   },

   new_round: function(){
      button.new_button();
      button.button_number = 0;
      button.last_button_outcome = 0;
      this.press_number = 0;
      this.round_number++;
   },

   record_press: function(outcome){
      let time_curr = (new Date()).getTime();
      let press_data = {
         "round_number": this.round_number,
         "press_number": this.press_number,
         "button_number": button.button_number,
         "current_p": button.current_p,
         "outcome": outcome,
         "press_time": time_curr - this.time
      }
      this.data.push(press_data);
      this.press_number++;
      this.time = time_curr;
   },

   return_csv: function(){
      let outcome = [];
      outcome.push('round_number,press_number,button_number,current_p,outcome,time');
      let dLen = this.data.length;
      let pLen = this.data[0].length-1;
      for(let i = 0; i < dLen; i++){
         let str_tmp = "";
         Object.values(this.data[i]).forEach(val => str_tmp = str_tmp + val + ',');
         str_tmp = str_tmp.substring(0, str_tmp.length - 1);
         outcome.push(str_tmp);
      }
      return outcome;
   },

   getData: function(){
      let outcome = this.data;
      let head_data = {"subjectID": subjectID, "is_time": initial_screen_time, "date": Date()};
      if(attention_check_results.length > 0) head_data = $.extend({}, head_data, {"attention_checks": attention_check_results});
      outcome.unshift(head_data);
      let dLen = this.data.length;
      return outcome;
   }
};

/*
*  Here goes the testing screen code
*/

//This function constructs button section with a single button which is displayed initially

function single_button_frame(driver){
   // appending button info section
   $('#button_section').html($('<div>', {
      'id': 'global_press_info'
   }));

   $('#global_press_info').append($('<div>', {
      'html': 'Remaining presses: ' + counter.remaining_presses,
      'id': 'presses_info'
   }));
   $('#global_press_info').append($('<div>', {
      'html': 'Total win: ' + counter.wins,
      'id': 'wins_info'
   }));

   // appending button area
   $('#button_section').append($('<div>', {
      'id': 'button_area'
   }));

   // intialize buttons
   $('#button_area').html('<div id="button_frame"></div>');

   $('#button_frame').append($('<div>', {
      'html': 'The current button',
      'class': 'arm_labels'
   }));
   $('#button_frame').append($('<img>', {
      'src': button_folder_path + 'button_' + button.current_button + '.jpg',
      'id': 'button',
      'class': 'arm_img' 
   }));

   // animating arms when mouse is hovering over them
   $('.arm_img').hover( function() {
      $(this).toggleClass('highlighted_arm_img');
   });

   driver();
};

//This function construct button section with an option to move to the next button

function two_button_frame(driver){
   // appending button info section
   $('#button_section').html($('<div>', {
      'id': 'global_press_info'
   }));

   $('#global_press_info').append($('<div>', {
      'html': 'Remaining presses: ' + counter.remaining_presses,
      'id': 'presses_info'
   }));
   $('#global_press_info').append($('<div>', {
      'html': 'Total win: ' + counter.wins,
      'id': 'wins_info'
   }));

   // appending button area
   $('#button_section').append($('<div>', {
      'id': 'button_area'
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
      'html': 'The current button',
      'class': 'arm_labels'
   }));
   $('#button_frame').append($('<img>', {
      'src': button_folder_path + 'button_' + button.current_button + '.jpg',
      'id': 'button',
      'class': 'arm_img'
   }));

   $('#arrow_frame').append($('<div>', {
      'html': 'Go to next button',
      'class': 'arm_labels'
   }));
   $('#arrow_frame').append($('<img>', {
      'src': next_button_arrow_path,
      'id': 'arrow',
      'class': 'arm_img' 
   }));

   // animating arms when mouse is hovering over them
   $('.arm_img').hover( function() {
      $(this).toggleClass('highlighted_arm_img');
   });

   driver();
};

//This function constructs after press message that provides extra instruction

function after_press_message(driver){
   // appending button info section
   $('#button_section').html('');

   if(button.last_button_outcome){
      $('#button_section').append($('<div>', {
         'html': after_press_win_message + '<br>\
                        Your total result after using this button is:',
         'id': 'after_press_description'
      }));
   }
   else{
      $('#button_section').append($('<div>', {
         'html': after_press_fail_message + '<br>\
                        Your total result after using this button is:',
         'id': 'after_press_description'
      }));
   }
   $('#button_section').append($('<div>', {
      'id': 'current_button_info'
   }));
   $('#current_button_info').append($('<div>', {
      'html': 'Current button presses: ' + button.presses,
      'id': 'current_presses_info'
   }));
   $('#current_button_info').append($('<div>', {
      'html': 'Current button wins: ' + button.wins,
      'id': 'current_wins_info'
   }));
   if(number_of_detailed_instructions > 0){
      $('#button_section').append($('<div>', {
            'html': after_press_detailed_instruction,
            'id': 'after_press_instruction'
      }));
      number_of_detailed_instructions--;
   }
   else{
      $('#button_section').append($('<div>', {
            'html': after_press_short_instruction,
            'id': 'after_press_instruction'
      }));
   }

   $(document).keyup(function(event) {
      if(event.which === 13) {
         $(document).off('keyup');
         two_button_frame(driver);
      }
   });
};

//This function constructs attention check frame

function attention_check_frame(driver){
   let num_choices = 5;
   let choice_num = Math.floor(num_choices*Math.random());

   $('#button_section').html($('<form>', {
      'id': 'attention_check_form'
   }));

   //Appending check form message
   $('#attention_check_form').append($('<div>', {
      'id': 'attention_check_message',
      'html': 'We just want to check that you are paying attention. Choose option ' + String(choice_num + 1) + ' if you are:'
   }));

   //Appending check form options
   for(let i = 0; i < num_choices; i++){
      $('#attention_check_form').append($('<div>', {
         'id': 'attention_option_' + i,
         'class': 'attention_choice_option'
      }));
      $('#attention_option_' + i).append($('<input>', {
         'type': 'radio',
         'name': 'attention_choice',
         'id': 'attention_choice_' + i,
         'value': String(i)
      }));
      $('#attention_option_' + i).append($('<label>', {
         'for': 'attention_choice_' + i,
         'html': 'Option ' + (i+1)
      }));
   }

   //Checking choice option
   $('#attention_check_form input').on('change', function() {
      $('#attention_check_form input').off();
      let correct_choice = ($('input[name=attention_choice]:checked', '#attention_check_form').val() == choice_num);
      if(correct_choice) attention_check_results.push(1);
      else attention_check_results.push(0);
      after_press_message(driver);
   });

};


//This function constructs the general experimental frame outlay

function experiment_frame(driver){
   $('body').html('');

   $('body').append($('<div>', {
      'id': 'button_section'
   }))
    
   single_button_frame(driver);
};

//These functions wait for current button or next button clicks and does all the related procedures 

//This is the practice part driver
var practice_driver = function(){
   if(button.button_number == 0 && button.presses == 0) button.current_p = 0.0; //The first always gives fails
   // choice is made when an arm is clicked on
   $('.arm_img').click(function() {
      var armID = this.getAttribute('id');
      if(armID == 'button'){
         var button_outcome = button.press_button();
         experimental_data.record_press(button_outcome);
         if(button_outcome) counter.count_win();
         else counter.count_fail();
         if(button.button_number == 1 && button.presses == 1) button.current_p = 0.0; //After the first win the second button always gives fails
      }
      if(armID == 'arrow'){
         button.new_button();
         if(button.button_number == 1) button.current_p = 1.0; //The second button always gives one first win
         button.update_button();
      }

      if(counter.remaining_presses == 0) experimental_screen();
      else if(armID == 'button'){
         if((counter.remaining_presses-1) % attention_check_interval == 0) attention_check_frame(practice_driver);
         else after_press_message(practice_driver);
      }
   })
};

//This is the main driver that handles the main part of the experiment
var main_driver = function(){
   // choice is made when an arm is clicked on
   $('.arm_img').click(function() {
      var armID = this.getAttribute('id');
      if(armID == 'button'){
         var button_outcome = button.press_button();
         experimental_data.record_press(button_outcome);
         if(button_outcome) counter.count_win();
         else counter.count_fail();
      }
      if(armID == 'arrow'){
         button.new_button();
         button.update_button();
      }
      
      if(counter.remaining_presses == 0) debrief_screen();
      else if(armID == 'button'){
         if((counter.remaining_presses-1) % attention_check_interval == 0) attention_check_frame(main_driver);
         else after_press_message(main_driver);
      }
   })
};

/*
*  Here goes the instruction screen code
*/ 

function instruction_screen(){
   initial_screen_time = (new Date()).getTime();
   $('body').html($('<div>', {
      'html': instruction_screen_description_part1,
      'id': 'instruction_screen'
   }));

   $(document).keyup(function(event) {
      if(event.which === 13) {
         $(document).off('keyup');
         $('body').html($('<div>', {
            'html': instruction_screen_description_part2,
            'id': 'instruction_screen'
         }));

         $(document).keyup(function(event) {
            if(event.which === 13) {
               $(document).off('keyup');
               initial_screen_time = (new Date()).getTime() - initial_screen_time;
               
               counter.new_counter(number_of_practice_presses);
               experiment_frame(practice_driver);
               experimental_data.start_timer();
            }
         });
      }
   });
};

//This function starts experimental screen

function experimental_screen(){
   $('body').html($('<div>', {
      'html': '<p>In the practice round you scored ' + counter.wins + ' wins out of ' + number_of_practice_presses + ' presses.</p>',
      'id': 'instruction_screen'
   }));
   $('#instruction_screen').append(after_practice_screen_description);

   $(document).keyup(function(event) {
      if(event.which === 13) {
         $(document).off('keyup');
         
         experimental_data.new_round();
         counter.new_counter(number_of_presses);
         experiment_frame(main_driver);
         experimental_data.start_timer();
      }
   });
};

/*
*  Here goes the debrief screen code
*/

function debrief_screen(){
   // $('body').html(debrief_screen_description);

   // //Temporary section that outputs the collected experimental data
   // $('body').append('<p>Time spent on the instruction screen: ' + initial_screen_time + '</p>');
   // var outcome = experimental_data.return_csv();
   // $('body').append('<p>');
   // for(let i = 0; i < outcome.length; i++){
   //    $('body').append(outcome[i] + '<br>');
   // }
   // $('body').append('</p>');

   // console.log(JSON.stringify(experimental_data.getData()));

   $.ajax({
      type: "POST",
      url: "/experiment-data",
      data: JSON.stringify(experimental_data.getData()),
      contentType: "application/json"
   })
   .done(function() {
       $('body').html(debrief_screen_description);
      // $('body').append('<p>Success!</p>');
   })
   .fail(function() {
      alert("A problem occurred while writing to the database. Please contact the researcher for more information.")
      window.location.href = "/";
   })
};

/*
*  Here goes the script that runs the experiment
*/

function run_experiment(){
   instruction_screen();
};