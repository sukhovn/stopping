/*
*  Here we define main experiment parameters
*/

var number_of_presses = 20;
var number_of_after_press_messages = 5; //Number of times after press message is flashed out
var subjectID = Math.round(Math.random()*100000000); //Random subject ID

var instruction_screen_description = '<p style="text-align: left;">&emsp; Welcome to the experiment about decision making. In the beginning of this experiment you will be given a series of buttons.\
                                       When you press a button you either receive a reward or you receive nothing. Each button has a fixed chance of giving a reward,\
                                       for example, one button may give a reward in 9 out of 10 presses on average, another may only give one reward per 10 presses.\
                                       Every button has its own unique chance of giving a reward.\
                                       You know that the buttons are distributed uniformly, which means you are equally likely to get a good or a bad button.<br>\
                                       &emsp; You start with a given button and a fixed number of ' + number_of_presses + ' presses. At each point in time you can either press a button\
                                       you currently have or request another one. You can request as many buttons as you like, however, you move to the next button you can no longer return\
                                       to any of the previous ones. Your goal is to get as many rewards as you can get given the number of presses. Good luck!</p>' 
                                    + '<p>Now press ENTER key to begin with the experiment.</p>';

var experimental_prompt = 'Click with a mouse to choose an option. Once you move to the next button you cannot return to the previous one.';
var debrief_screen_description = '<p>That\'s it. Thank you for your participation!<br>Please save or write down the following number: ' + 
                                    subjectID + '</p>';

var button_folder_path = 'pictures/square_buttons/'
var next_button_arrow_path = 'pictures/white_arrow.jpeg'
var after_press_win_message = 'Congratulations, after pressing the button you got 1 point!'
var after_press_fail_message = 'Unfortunately, after pressing the button you get nothing.'
var after_press_message_instruction = 'Now you have a choice: you can either continue pressing this button and observe the outcome.\
                        Alternatively, you can make the decision to move to the next button. Press ENTER key to continue.'

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
      $('#current_presses_info').html('Current button presses: ' + this.presses);
      $('#current_wins_info').html('Current button wins: ' + this.wins);
      $('#button').attr('src', button_folder_path + 'button_' + this.current_button + '.jpg');
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
      $('#presses_info').html('Remaining presses: ' + this.remaining_presses);
      $('#wins_info').html('Total win: ' + this.wins);
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
   press_number: 0,

   start_timer: function(){
      this.time = (new Date()).getTime();
   },

   record_press: function(outcome){
      let time_curr = (new Date()).getTime();
      var press_data = {
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
      var outcome = [];
      outcome.push('press_number,button_number,current_p,outcome,time');
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
      var outcome = this.data;
      outcome.unshift({"subjectID": subjectID, "is_time": initial_screen_time, "date": Date()});
      let dLen = this.data.length;
      return outcome;
   }
};

/*
*  Here goes the instruction screen code
*/ 

function instruction_screen(){
   initial_screen_time = (new Date()).getTime();
   $('body').html($('<div>', {
      'html': instruction_screen_description,
      'id': 'instruction_screen'
   }));

   $(document).keyup(function(event) {
      if(event.which === 13) {
         initial_screen_time = (new Date()).getTime() - initial_screen_time;
         $(document).off('keyup');
         experimental_screen();
      }
   });
};

/*
*  Here goes the testing screen code
*/

//This function constructs button section with a single button which is displayed initially

function single_button_frame(){
   // appending button info section
   $('#button_section').html($('<div>', {
      'id': 'current_button_info'
   }));

   $('#current_button_info').attr('style', 'border-bottom: 1px solid #eaeaea');
   $('#current_button_info').append($('<div>', {
      'html': 'Current button presses:',
      'id': 'current_presses_info'
   }));
   $('#current_button_info').append($('<div>', {
      'html': 'Current button wins:',
      'id': 'current_wins_info'
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
      'src': button_folder_path + 'button_0.jpg',
      'id': 'button',
      'class': 'arm_img' 
   }));

   // animating arms when mouse is hovering over them
   $('.arm_img').hover( function() {
      $(this).toggleClass('highlighted_arm_img');
   });
}

//This function construct button section with an option to move to the next button

function two_button_frame(){
   // appending button info section
   $('#button_section').html($('<div>', {
      'id': 'current_button_info'
   }));

   $('#current_button_info').attr('style', 'border-bottom: 1px solid #eaeaea');
   $('#current_button_info').append($('<div>', {
      'html': 'Current button presses:',
      'id': 'current_presses_info'
   }));
   $('#current_button_info').append($('<div>', {
      'html': 'Current button wins:',
      'id': 'current_wins_info'
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
      'src': button_folder_path + 'button_0.jpg',
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
}

//This function constructs after press message that provides extra instruction

function after_press_message(outcome){
   // appending button info section
   $('#button_section').html('');

   if(outcome){
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
      'html': 'Current button presses:',
      'id': 'current_presses_info'
   }));
   $('#current_button_info').append($('<div>', {
      'html': 'Current button wins:',
      'id': 'current_wins_info'
   }));
   $('#button_section').append($('<div>', {
         'html': after_press_message_instruction,
         'id': 'after_press_instruction'
   }));

   button.update_button();

   $(document).keyup(function(event) {
      if(event.which === 13) {
         two_button_frame();
         button.update_button();
         $(document).off('keyup');
         driver();
      }
   });
}

//This function constructs the general experimental frame outlay

function experiment_frame(){
   $('body').html('');
   // header part
   $('body').append($('<div>', {
      'id': 'header'
   }));

   $('#header').append($('<div>', {
      'html': 'Remaining presses:',
      'id': 'presses_info'
   }));
   $('#header').append($('<div>', {
      'html': 'Total win:',
      'id': 'wins_info'
   }));

   // current button info part
   $('body').append($('<div>', {
      'id': 'button_section'
   }))
    
   single_button_frame();
   
   // appending footer, below the screen part with the bandits
   $('body').append($('<div>', {
      'id': 'footer'
   }));

   // prompt

   $('#footer').append($('<div>', {
      'html': experimental_prompt,
      'id': 'prompt'
   }));
};

//This function waits for current button or next button clicks and does all the related procedures 

function driver(){
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
      }
      counter.update_counter();
      button.update_button();
      if(counter.remaining_presses == 0) debrief_screen();
      if(armID == 'button' && number_of_after_press_messages > 0){
         number_of_after_press_messages--;
         after_press_message(button_outcome);
      }
   })
}

//This function starts experimental screen

function experimental_screen(){
   experiment_frame();
   counter.update_counter();
   button.update_button();

   experimental_data.start_timer();
   driver();
};

/*
*  Here goes the debrief screen code
*/

function debrief_screen(){
   // $('body').html(debrief_screen_description);

   //Temporary section that outputs the collected experimental data
   // $('body').append('<p>Time spent on the instruction screen: ' + initial_screen_time + '</p>');
   // var outcome = experimental_data.return_csv();
   // $('body').append('<p>');
   // for(let i = 0; i < outcome.length; i++){
   //    $('body').append(outcome[i] + '<br>');
   // }
   // $('body').append('</p>');

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

   // console.log(JSON.stringify(experimental_data.getData()));
};

/*
*  Here goes the script that runs the experiment
*/

function run_experiment(){
   instruction_screen();
}