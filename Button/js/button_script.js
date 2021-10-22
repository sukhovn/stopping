/*
*  Here we define main experiment parameters
*/

var number_of_presses = 20;
var price_per_win = 0.1;
var message_duration = 3; //Message duration for win and fail messages in seconds
var subjectID = Math.round(Math.random()*100000000); //Random subject ID
/*
* Here we define attention screen frequency
*/

var attention_check_interval = 10;
var attention_check_results = []; //Tracks the results of attention checks, if the check is passed, the result is 1, else 0

var instruction_screen_description_part1 = '<p style="text-align: left;">&emsp; Welcome to the experiment about decision making. In this experiment you will be given a series of buttons.\
                                       When you press a button you either randomly receive a reward or you receive nothing. Each button has a fixed chance of giving a reward,\
                                       for example, one button may give a reward in 9 out of 10 presses on average, another may only give an average of one reward per 10 presses.\
                                       Every button has its own unique chance of giving a reward.  You know that the buttons are distributed uniformly, which means you are equally likely to get a good or a bad button.</p>'
                                    +  '<p>Press ENTER to continue.</p>'
var instruction_screen_description_part2 = '<p style="text-align: left;">&emsp;\
                                       &emsp; You start with a given button and a fixed number of ' + number_of_presses + ' presses. At each point in time you can either press the button\
                                       you currently have or request another one. Moving to the next button has no cost, you can change as many buttons as you want, however, when you move to the next button you can no longer return\
                                       to any of the previous ones. Your goal is to get as many rewards as you can get given the number of presses, you will be payed based on the accumulated reward you receive. Good luck!</p>'
                                    + '<p>Now press ENTER key to begin with the practice round.</p>';
// var tutorial_instructions = {message: 'Pr'}
var tutorial_instructions = [
   {message: 'We begin with a simple tutorial. Just follow the instructions on screen. Press ENTER to continue.', 
      highlight: 'none', trigger: 'enter'},
   {message: 'Let us give the button a press.', highlight: '#button_frame', trigger: 'button', button_p: 1.0},
   {message: 'Congratulations, your first press gives you a reward! You can see on the highlighted section that you have accumulated one reward.\
               However, you have also spent one button press. Press the button again a couple of times.', 
      highlight: '#info_area', trigger: 'button', button_p: 1.0},
   {message: 'Another win! Press the button again.', 
      highlight: 'none', trigger: 'button', button_p: 0.0},
   {message: 'This time you weren\'t so lucky. The button gave you no reward. Let\'s press the button a few more times' , highlight: '#info_area', trigger: 'button', button_p: 0.0},
   {message: 'Again no reward this time.' , highlight: 'none', trigger: 'button', button_p: 0.0},
   {message: 'Again no reward this time.' , highlight: 'none', trigger: 'button', button_p: 1.0},
   {message: 'Congratulations, you get another reward! Now that you have given the button a few presses you can get a feeling how it performs. Press enter to continue' , highlight: '#info_area', trigger: 'enter'},
   {message: 'Let\'s suppose you are not satisfied with this button\'s performace. Press next button to get another button.', highlight: '#next_button_frame', trigger: 'next button'},
   {message: 'You can notice that your button has changed. Your statistics reflects this change. Press next button another time.', highlight: '#info_area', trigger: 'next button'},
   {message: 'Notice that choosing next button does not count as a button press. You are free to change as many buttons as you want for free. Press next button another time.', highlight: '#info_area', trigger: 'next button'}
]

var after_tutorial_presses = 100;
var after_tutorial_message = 'You have got some feel of the experimental setup now. We will give you ' + after_tutorial_presses + ' presses to play around if you want.\
                              This round will not count towards your performance. You can press ENTER whenever you want to begin with the experiment.';
var experimental_round_message = 'This is the experimental round. Good luck!';

var debrief_screen_description = '<p>That\'s it. Thank you for your participation!</p>' 
var ID_message = '<p>Please save or write down the following number: ' + subjectID + '</p>';

var button_folder_path = 'pictures/square_buttons/';
var next_button_arrow_path = 'pictures/white_arrow.jpeg';
var after_press_win_message = 'Congratulations, after pressing the button you got 1 point!';
var after_press_fail_message = 'Unfortunately, after pressing the button you get nothing.';

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
      this.update_button();
   };

   core.update_button_info = function(){
      $('#current_presses_info').html('Current button presses: ' + this.presses);
      $('#current_wins_info').html('Current button wins: ' + this.wins);
   };

   core.update_button = function(){
      this.update_button_info();
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
      this.update_counter();
   },

   update_counter: function(npress){
      $('#presses_info').html('Remaining presses: ' + this.remaining_presses);
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
      let head_data = {"subjectID": subjectID, "is_time": initial_screen_time, "date": Date(), "total_win": counter.wins};
      if(attention_check_results.length > 0) head_data = $.extend({}, head_data, {"attention_checks": attention_check_results});
      outcome.unshift(head_data);
      let dLen = this.data.length;
      return outcome;
   }
};

/*
*  Here goes the testing screen code
*/

//This function constructs attention check frame

// function attention_check_frame(driver){
//    let num_choices = 5;
//    let choice_num = Math.floor(num_choices*Math.random());

//    $('#button_section').html($('<form>', {
//       'id': 'attention_check_form'
//    }));

//    //Appending check form message
//    $('#attention_check_form').append($('<div>', {
//       'id': 'attention_check_message',
//       'html': 'We just want to check that you are paying attention. Choose option ' + String(choice_num + 1) + ' if you are:'
//    }));

//    //Appending check form options
//    for(let i = 0; i < num_choices; i++){
//       $('#attention_check_form').append($('<div>', {
//          'id': 'attention_option_' + i,
//          'class': 'attention_choice_option'
//       }));
//       $('#attention_option_' + i).append($('<input>', {
//          'type': 'radio',
//          'name': 'attention_choice',
//          'id': 'attention_choice_' + i,
//          'value': String(i)
//       }));
//       $('#attention_option_' + i).append($('<label>', {
//          'for': 'attention_choice_' + i,
//          'html': 'Option ' + (i+1)
//       }));
//    }

//    //Checking choice option
//    $('#attention_check_form input').on('change', function() {
//       $('#attention_check_form input').off();
//       let correct_choice = ($('input[name=attention_choice]:checked', '#attention_check_form').val() == choice_num);
//       if(correct_choice) attention_check_results.push(1);
//       else attention_check_results.push(0);
//       after_press_message(driver);
//    });

// };


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

      // intialize info
      $('#button_section').append($('<div>', {
         'id': 'info_area',
      }));
      $('#info_area').append($('<div>', {
         'html': 'Remaining presses: ' + number_of_presses,
         'id': 'presses_info',
         'class': 'info_message'
      }));
      $('#info_area').append($('<div>', {
         'html': 'Current button presses: ' + button.presses,
         'id': 'current_presses_info',
         'class': 'info_message'
      }));
      $('#info_area').append($('<div>', {
         'html': 'Current button wins: ' + button.wins,
         'id': 'current_wins_info',
         'class': 'info_message'
      }));

      // initialize the next button
      $('body').append($('<div>', {
         'id': 'next_button_frame',
      }));

      $('#next_button_frame').append($('<button>', {
         'type': 'button',
         'id': 'next_button',
         'html': 'Next button',
      }));
};

//These functions wait for current button or next button clicks and does all the related procedures 

var message_remove = 0;

function flash_message(message){
   clearTimeout(message_remove);

   $('#message_area').html($('<div>', {
      'html': message,
      'id': 'flash_message'
   }));

   message_remove = setTimeout(function(){
      $('#message_area').html('');
   }, message_duration*1000);
}

function driver_practice(){
   $('#next_button').attr('onclick', 'button.new_button();');
   // choice is made when an arm is clicked on
   $('.arm_img').off('click');
   $('.arm_img').click(function() {
      var armID = this.getAttribute('id');
      if(armID == 'button'){
         var button_outcome = button.press_button();
         experimental_data.record_press(button_outcome);
         if(button_outcome) counter.count_win();
         else counter.count_fail();
         button.update_button_info();
         counter.update_counter();
      }
      if(counter.remaining_presses == 0) experimental_run();
   })
};

function driver(){
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
      if(counter.remaining_presses == 0) debrief_screen();
   })
};

/*
*  Here goes the instruction screen code
*/ 

function instruction_screen(){
   initial_screen_time = (new Date()).getTime();
   instruction_list = [instruction_screen_description_part1, instruction_screen_description_part2];
   instruction_prompt.run(instruction_list, function(){
      initial_screen_time = (new Date()).getTime() - initial_screen_time;
               
      counter.new_counter(number_of_presses);
      experiment_frame();

      tutorial.run(tutorial_instructions, post_tutorial);
   });
};

function post_tutorial(){
   $('#message_area').html($('<div>', {
      'id': 'tutorial_message'
   }));

   $('#tutorial_message').html($('<span>', {
      'html': after_tutorial_message,
   }))

   counter.new_counter(after_tutorial_presses);
   button.new_button();
   button.button_number = 0;
   button.last_button_outcome = 0;
   $('#next_button').attr('onclick', 'button.new_button()');
   driver_practice();
   experimental_data.start_timer();

   $(document).keyup(function(event) {
      if(event.which === 13) {
         $(document).off('keyup');
         experimental_run();
      }
   });
}

function experimental_run(){
   $('#message_area').html('');
   counter.new_counter(number_of_presses);
   driver();
   experimental_data.start_timer();
   experimental_data.new_round();
   
   $('#message_area').html($('<div>', {
      'id': 'tutorial_message'
   }));

   $('#tutorial_message').html($('<span>', {
      'html': experimental_round_message,
   }))

   message_remove = setTimeout(function(){
      $('#message_area').html('');
   }, message_duration*1000);
}

/*
*  Here goes the debrief screen code
*/

function debrief_screen(){
   // $('body').html($('<div>', {
   //    'id': 'instruction_screen'
   // }));
   // $('#instruction_screen').append(debrief_screen_description);
   // $('#instruction_screen').append($('<p>', {
   //    'html': 'You scored ' + counter.wins + ' wins, this will be converted into ' + Number.parseFloat(price_per_win*counter.wins).toFixed(1) + '$, \
   //                the bonus will be payed to you in 1-2 days time.'
   // }))
   // $('#instruction_screen').append(ID_message);

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
      $('body').html($('<div>', {
         'id': 'instruction_screen'
      }));
      $('#instruction_screen').append(debrief_screen_description);
      $('#instruction_screen').append($('<p>', {
         'html': 'Overall you scored ' + counter.wins + ' wins, this will be converted into ' + Number.parseFloat(price_per_win*counter.wins).toFixed(1) + '$, \
                     the bonus will be payed to you in 1-2 days time.'
      }))
      $('#instruction_screen').append(ID_message);
   })
   .fail(function() {
      alert("A problem occurred while writing to the database. Please contact the researcher for more information.")
      // window.location.href = "/";
   })
};

/*
*  Here goes the script that runs the experiment
*/

function run_experiment(){
   instruction_screen();
};