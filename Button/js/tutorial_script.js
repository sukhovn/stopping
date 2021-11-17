/*
* Here we define instruction screen instructions
*/

var instruction_screen_description_part1 = '<p style="text-align: center;">&emsp; <h2>Instructions</h2></p>' + 
                                          '<p>Welcome! In this experiment we will ask you to make some simple decisions. You will receive points for each decision. Your goal is to collect as many points as you can. \
                                          Each point you receive will give you a bonus of $' + price_per_win.toFixed(3) + '. The maximum points you can collect is <b>' + number_of_presses + '</b>, \
                                          so you can receive a bonus of up to $' + Number.parseFloat(price_per_win*number_of_presses).toFixed(0) + ' in the task! </p>' +  '<p>Please press ENTER to continue.</p>'

var instruction_screen_description_part2 = '<p style="text-align: center;">&emsp; <h2>Button presses and points</h2></p>' + 
                                          '<p> In the experiment, we will provide you with a series of buttons to press. \
                                          When you press a button, the button will randomly provide either 1 point or 0 points. \
                                          Each button has a different chance of providing a point. \
                                          For example, one button may give a point 9 out of 10 times while another button \
                                          may only give a point 1 out of 10 times. You will have the opportunity to press each button multiple times if you want to. \
                                          Every time you press a particular button you have the same chance of getting a point. </p>' +
                                          '<p> <b>Important:</b> The probability with which each button gives you a point is determined randomly, \
                                          and all probabilities are equally likely. Every time you select a new button, you are equally likely to get \
                                          a good or a bad button.</p>' + '<p>Please press ENTER to continue.</p>'                                    
var instruction_screen_description_part3 = '<p style="text-align: left;">&emsp; \
                                          &emsp; <h2>Pressing current button and choosing a new one</h2>' +
                                          '<p> At the start of the experiment, we will provide you with one randomly selected button to press and a total of <b>' + 
                                          number_of_presses + '</b> button presses.</p>'+ '<p> For each button press, you can choose to either press \
                                          the button you currently have or you can request a new button to press. \
                                          Requesting a new button has no cost -- you can choose to change the button as many times as you want. \
                                          However, when you move to the next button, you will not be able to select any of your previous buttons.</p>' + 
                                          '<p>Your goal is to get as many points as you can get given the number of presses you have. \
                                          You will be paid based on the accumulated points you receive, for a total of $' + price_per_win.toFixed(3) + ' per point. Good luck!</p>' + 
                                          '<p>Please press ENTER key to continue.</p>';

var instruction_list = [instruction_screen_description_part1, instruction_screen_description_part2, instruction_screen_description_part3];

var recap_instruction_list = ['<p style="text-align: center;">&emsp; <h2>Instructions recap</h2></p>' + '<p>&emsp; \
                           We provide you with a series of buttons to press. When you press a button, the button will either randomly provide 1 point or provide 0 points. \
                           Each button has a fixed UNIQUE chance of providing a point. At the start of the experiment, we provide you a total of <b>' + 
                           number_of_presses + '</b> button presses.</p>'+ '<p> Each time you press a button, you can choose to either press \
                           the button you currently have or you can request a new button to press. \
                           Requesting a new button has no cost. \
                           However, when you move to the next button, you will not be able to select any of your previous buttons.</p>' + 
                           '<p>Your goal is to get as many points as you can get given the number of presses you have.</p>' + 
                           '<p>Please press ENTER key to continue.</p>'];

/*
* Here we define tutorial instructions
*/

var tutorial_instructions = [
   {message: 'To help you understand the task, let us start with a simple tutorial. Simply follow the instructions on screen. Press ENTER to continue.', 
      highlight: 'none', trigger: 'enter'},
   {message: 'Please give the highlighted red button a press.', highlight: '#button_frame', trigger: 'button', button_p: 1.0},
   {message: 'Congratulations, your first press gives you a point! You can see on the highlighted section that you have accumulated one point.\
               However, you have also spent one button press. Press the button again a couple of times.', 
               highlight: '#info_area', trigger: 'button', button_p: 1.0},
   {message: 'Another point! Press the button again.', 
      highlight: 'none', trigger: 'button', button_p: 0.0},
   {message: 'This time you weren\'t so lucky. The button gave you no point. Let\'s press the button a few more times.' , highlight: '#info_area', trigger: 'button', button_p: 0.0},
   {message: 'Again, the button gave you no point.' , highlight: 'none', trigger: 'button', button_p: 0.0},
   {message: 'And again, the button gave you no point.' , highlight: 'none', trigger: 'button', button_p: 1.0},
   {message: 'Congratulations, you get another point! Now that you have given the button a few presses you can get a feeling for how it performs. Press ENTER to continue.' , highlight: '#info_area', trigger: 'enter'},
   {message: 'Let\'s suppose you are not satisfied with this button\'s performance. Press the highlighted box to get another button.', highlight: '#next_button_frame', trigger: 'next button'},
   {message: 'You can notice that your button has changed. Request a new button again.', highlight: '#info_area', trigger: 'next button'},
   {message: '<b>Notice that requesting a new button does not count as a button press.</b> You are free to request as many buttons as you want for free. Request a new button another time.', highlight: '#info_area', trigger: 'next button'}
];

/*
* Here we define quiz questions
*/

var quiz_message = 'Before we continue please answer the following short quiz';

var quiz_questions = [
   {question: 'How many total button presses will you get in the experiment?', answer_1: number_of_presses, answer_2: '50', answer_3: '100', correct: 1},
   {question: 'What happens when you select the option of requesting a new button', answer_1: 'The number of button presses you have is reduced by 1', 
                                                                                    answer_2: 'The number of button presses you have is reduced by 2', 
                                                                                    answer_3: 'The number of button presses you have remains the same as before', 
                                                                                    correct: 3},
   {question: 'What is the maximum number of points you can obtain with a single button press', answer_1: '0 points', answer_2: '1 point', answer_3: '2 points', 
                                                                                    correct: 2}
];

var quiz_fail = 0;
var quiz_fail_message = ['<p style="text-align: center;">&emsp; <h2>Quiz results</h2></p>' + 
                     '<p>You have answered at least one of the questions incorrectly.\
                     All of the information presented is very important for the experiment.\
                     Please, complete the tutorial again.</p>' + 
                     '<p>Press ENTER key to continue.</p>'];

var main_experiment_announcement = ['<p style="text-align: center;">&emsp; <h2>The tutorial is completed</h2></p>' + 
                                    '<p>Now the main experiment will begin.</p>' + 
                                    '<p>Please press ENTER key to continue.</p>'];

/*
*  Here goes the instruction screen code
*/ 

function instruction_screen(){
   instruction_screen_time = (new Date()).getTime();
   instruction_prompt(instruction_list, function(){
      instruction_screen_time = (new Date()).getTime() - instruction_screen_time;
               
      counter.new_counter(number_of_presses);
      experiment_frame();

      tutorial_time = (new Date()).getTime();
      tutorial(tutorial_instructions, function(){
         tutorial_time = (new Date()).getTime() - tutorial_time;
         post_instruction_screen();
      });
   });
};

function post_instruction_screen(){
   instruction_prompt(recap_instruction_list, function(){
      quiz(quiz_message, quiz_questions, function(){
         var has_errors = 0;
         for(let i = 0; i < quiz_answers.length; i++){
            if(quiz_answers[i] == 0){has_errors = 1;}
         }
         if(has_errors == 1){
            quiz_fail += 1;
            experimental_data.new_round();
            instruction_prompt(quiz_fail_message, instruction_screen);
         }
         else{
            instruction_prompt(main_experiment_announcement, experimental_run);
         }
      });
   });
}