/*
*  Here we define main experiment parameters
*/

var number_of_presses = 100;
var p_truncation = 0.9;
var base_pay = 1.8;
var price_per_win = 0.01;
var prolificID = 'none';
var subjectID = Math.round(Math.random()*100000000); //Random subject ID

/*
* Here we define practice round and main round parameters
*/

var button_folder_path = 'pictures/square_buttons/';
var next_button_arrow_path = 'pictures/white_arrow.jpeg';
var after_press_win_message = 'Congratulations, after pressing the button you got 1 point!';
var after_press_fail_message = 'Unfortunately, after pressing the button you get nothing.';

var instruction_screen_time; //Records the time the test subject looked at the instruction screen
var tutorial_time; //Records the time the test subject spent on the tutorial

/*
*  Here goes the main experimental code
*  Here we define main experimental classes
*/

//This object generates button presses outcomes and updates button pictures and counter
function button_press_message(presses, wins){
   let message = 'You have pressed this button <b>' + button.presses +'</b> '
   if(presses == 1) message += 'time';
   else message += 'times';
   message += ' and received <b>' + button.wins + '</b> ';
   if(wins == 1) message += 'point';
   else message += 'points';
   return message;
}

var button = (function(){
   let core = {};

   core.button_number = 0;
   core.current_p = p_truncation*Math.random();
   core.presses = 0;
   core.wins = 0;

   core.number_of_buttons = 10;
   //Initial button shuffling
   core.button_order = [0].concat(random_transposition(1, core.number_of_buttons));
   core.current_button = 0;

   //Randomly reshuffle the buttons
   core.reshuffle_buttons = function(){
      this.button_order = random_transposition(0, core.number_of_buttons);
   }

   core.new_button = function(){
      this.current_p = p_truncation*Math.random();      

      // do{
      //    var random_number = Math.floor(this.number_of_buttons*Math.random());
      // }
      // while(random_number == this.current_button);
      // this.current_button = random_number;

      this.current_button++;
      if(this.current_button == this.number_of_buttons) this.current_button = 0;

      if(this.presses > 0) this.button_number++;
      this.presses = 0;
      this.wins = 0;
      this.update_button();
   };

   core.update_button_info = function(){
      $('#current_button_info').html(button_press_message(button.presses, button.wins));
   };

   core.update_button = function(){
      this.update_button_info();
      $('#button').attr('src', button_folder_path + 'button_' + this.button_order[this.current_button] + '.jpg');
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
   remaining_presses: 0,
   wins: 0,

   new_counter: function(npress){
      this.remaining_presses = npress;
      this.wins = 0;
      this.update_counter();
   },

   update_counter: function(npress){
      $('#presses_info').html('You have <b>' + this.remaining_presses +'</b> button presses remaining');
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
   practice_data: [],
   main_data: [],
   time: 0,
   // round_number: 0,
   press_number: 0,
   practice_round: 0,

   start_timer: function(){
      this.time = (new Date()).getTime();
   },

   new_round: function(){
      button.new_button();
      button.button_number = 0;
      button.current_button = 0;
      this.press_number = 0;
   },

   record_press: function(outcome){
      let time_curr = (new Date()).getTime();
      let press_data = {
         // "round_number": this.round_number,
         "press_number": this.press_number,
         "button_number": button.button_number,
         "current_p": button.current_p,
         "outcome": outcome,
         "press_time": time_curr - this.time
      }
      if(this.practice_round == 1) this.practice_data.push(press_data);
      else this.main_data.push(press_data);
      this.press_number++;
      this.time = time_curr;
   },

   getData: function(){
      let head_data = {"subjectID": subjectID, "prolificID": prolificID, "inst_time": instruction_screen_time, "tut_time": tutorial_time, "date": Date(), "total_win": counter.wins, "quiz_failed": quiz_fail};
      let outcome = $.extend({}, head_data,  {"practice_data": experimental_data.practice_data}, {"press_data": experimental_data.main_data}, {"feedback": "none"});
      return outcome;
   }
};