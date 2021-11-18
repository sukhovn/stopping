/*
* Here we define post experiment parameters
*/

var prolific_title = "Prolific ID";
var prolific_message = "Please, enter your Prolific ID so we can pay you your bonus";

function request_ID(){
	$('body').html($('<h2>',{
		'html': prolific_title
	}))
	
	$('body').append($('<form>', {
		'id': 'prolific_request'
	}));

	$('#prolific_request').append($('<div>',{
		'id': 'prolific_instruction',
		'html': prolific_message
	}));
	$('#prolific_request').append($('<input>',{
		'type': 'text',
		'id': 'prolific_input',
	}));
	$('#prolific_request').append($('<input>',{
		'type': 'submit',
		'class': 'submit-button',
		'id': 'ID_submit',
		'value': 'Submit ID'
	}));
	$('#prolific_request').append($('<div>', {
		'id': 'prolific_warning'
	}));


	$('#prolific_request').submit(function(event){
		if($('#prolific_input').val() == ""){
			$('#prolific_warning').text( "Please enter your ID!" ).show().fadeOut(2000);
  			event.preventDefault();
		}
		else{
			prolificID = $('#prolific_input').val();
			run_experiment();
		}
	});
}