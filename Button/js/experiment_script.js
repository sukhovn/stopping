/*
* Here we define post experiment parameters
*/

var debrief_screen_description = '<p>The experiment is now complete. Thank you for your participation!</p>' 
var ID_message = '<p>Here is your unique completion code: 531B56EC.</p>';

var feedback_instruction = 'If you felt that the task was unclear or you have some ideas how to improve the experiment,\
                              please leave your feedback here. Thank you!';
var post_feedback_message = 'Your feedback has been recorded. Thank you!<br>You may now close the web page.';

/*
*  Here goes the debrief screen code
*/

function debrief_screen(){
   let total_pay = base_pay + price_per_win*counter.wins;
   // $('body').html($('<div>', {
   //    'id': 'instruction_screen'
   // }));
   // $('#instruction_screen').append(debrief_screen_description);
   // $('#instruction_screen').append($('<p>', {
   //    'html': 'Overall you scored ' + counter.wins + ' points, this will be converted into ' + Number.parseFloat(Math.ceil(100*total_pay)/100).toFixed(2) + '$, \
   //             the bonus will be payed to you in 1-2 days time.'
   // }))
   // $('#instruction_screen').append(ID_message);

   // feedback_window.feedback_instruction = feedback_instruction;
   // feedback_window.post_feedback_message = post_feedback_message;
   // feedback_window.show(function(){
   //    console.log(feedback_window.feedback);
   //    feedback_window.submission_success();
   // });

   // console.log(JSON.stringify(experimental_data.getData()));

   //Saving experimental data
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
         'html': 'Overall you scored ' + counter.wins + ' points, this will be converted into ' + Number.parseFloat(Math.ceil(100*total_pay)/100).toFixed(2) + '$, \
                     the bonus will be payed to you in 1-2 days time.'
      }))
      $('#instruction_screen').append(ID_message);
      //Requesting feedback
      feedback_window.feedback_instruction = feedback_instruction;
      feedback_window.post_feedback_message = post_feedback_message;
      feedback_window.show(function(){
         //Saving feedback if it is different from the feedback message
         if(feedback_window.feedback != feedback_window.feedback_message){
            $.ajax({
               type: "POST",
               url: "/experiment-feedback/" + subjectID,
               data: JSON.stringify({feedback: feedback_window.feedback}),
               contentType: "application/json"
            })
            .done(function() {
               feedback_window.submission_success();
            })
            .fail(function() {
               alert("A problem occurred while writing to the database. Please contact the researcher for more information.")
            })
         }
         else{
            feedback_window.submission_success();
         }
      });
   })
   .fail(function() {
      alert("A problem occurred while writing to the database. Please contact the researcher for more information.")
   })
};

/*
*  Here goes the script that runs the experiment
*/

function run_experiment(){
   instruction_screen();
};