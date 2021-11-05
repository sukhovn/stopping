function instruction_prompt(input_list, input_next){
	let core = {
		instruction_list: input_list,
		list_length: input_list.length,
		current: 0,
		next_step: input_next,
	};
	core.display_prompt = function(){
		if(this.current == this.list_length) this.next_step();
		else{
			$('body').html($('<div>', {
				'html': this.instruction_list[this.current],
				'id': 'instruction_screen'
			}));
			this.current++;
			$(document).keyup(function(event){
				if(event.which === 13) {
					$(document).off('keyup');
					core.display_prompt();
	    		}
			});		
		};
	};
	core.display_prompt();
};

function tutorial(tutorial_instructions, input_next){
	let core = {
		instructions: tutorial_instructions,
		list_length: tutorial_instructions.length,
		current: 0,
		next_step: input_next
	}

	core.display_prompt = function(){
		if(this.current == this.list_length){
			$('#message_area').html('');
			this.next_step();
		}
		else{
			// Displaying message
			$('#message_area').html($('<div>', {
				'id': 'tutorial_message'
	   		}));

			$('#tutorial_message').html($('<span>', {
				'html': this.instructions[this.current]['message'],
			}))

			// Highlighting selected
			let el_highlight = this.instructions[this.current]['highlight'];
			if(el_highlight != 'none'){
				$(el_highlight).css({'border-style': 'solid', 'border-color': 'red'});
			}
			
			// Setting triggers
			if(this.instructions[this.current]['trigger'] == 'enter'){
				$(document).keyup(function(event) {
	      			if(event.which === 13) {
	        			$(document).off('keyup');
	        			if(el_highlight != 'none'){
							$(el_highlight).css({'border-style': '', 'border-color': ''});
						}
		        		core.display_prompt();
		        	}
				});
			}
			else if(this.instructions[this.current]['trigger'] == 'next button'){
				$("#next_button").on('click', function(){
					$("#next_button").off('click');
					if(el_highlight != 'none'){
						$(el_highlight).css({'border-style': '', 'border-color': ''});
					}
					button.new_button();
					core.display_prompt();
				});
			}
			else if(this.instructions[this.current]['trigger'] == 'button'){
				button.current_p = this.instructions[this.current]['button_p']; 
				$("#button").on('click', function(){
					$("#button").off('click');
					if(el_highlight != 'none'){
						$(el_highlight).css({'border-style': '', 'border-color': ''});
					}
					var button_outcome = button.press_button();
					if(button_outcome) counter.count_win();
					else counter.count_fail();
					button.update_button_info();
					counter.update_counter();
					core.display_prompt();
				});
			}
			this.current++;
		}
	}

	core.display_prompt();
};

var quiz_answers = [];

function quiz(quiz_message, quiz_instructions, input_next){
	let core = {
		message: quiz_message,
		instructions: quiz_instructions,
		list_length: quiz_instructions.length,
		current: 0,
		next_step: input_next,
	}

	core.quiz_display = function(){
		$('body').html($('<div>', {
			'id': 'header',
		}));

		$('#header').html($('<div>', {
			'id': 'message_area'
		}));

		$('#message_area').html($('<div>', {
			'id': 'tutorial_message'
	   	}));

		$('#tutorial_message').html($('<span>', {
			'html': this.message
		}))

		// initialize button area where the quiz will take place
		$('body').append($('<div>', {
			'id': 'button_section',
		}));

      	// intialize info
		$('#button_section').append($('<div>', {
			'id': 'info_area',
		}));

		// technical element
		$('body').append($('<div>', {
			'id': 'test',
		}));
	}

	core.display_prompt = function(){
		if(this.current == this.list_length){
			$('body').html('');
			this.next_step();
		}
		else{
			$('#button_section').html($('<form>', {
				'id': 'question_form'
			}));

			//Appending check form message
			$('#question_form').append($('<div>', {
				'id': 'question_message',
				'html': this.instructions[this.current]['question']
			}));

			$('#question_form').append($('<div>', {
				'id': 'quiz_choices'
			}));

			// Printing out answers
			let ans = Object.keys(this.instructions[this.current]).filter(function(x){return x.split('_')[0] == 'answer';});
			let numbers = ans.map(function(x){return x.split('_')[1];}).sort();
			
			let width = 0;

			for(let i = 0; i < numbers.length; i++){
				$('#quiz_choices').append($('<div>', {
					'id': 'question_option_' + i,
					'class': 'question_option'
				}));
				$('#question_option_' + i).append($('<input>', {
					'type': 'radio',
					'name': 'question_choice',
					'id': 'question_choice_' + i,
					'value': numbers[i]
				}));
				$('#question_option_' + i).append($('<label>', {
					'for': 'question_choice_' + i,
					'id': 'question_choice_' + i + '_label',
					'html': this.instructions[this.current]['answer_' + numbers[i]]
				}));
				
				// Estimating width of the question part
				let width_tmp = $('#question_choice_' + i).outerWidth() + $('#question_choice_' + i + '_label').outerWidth();
				if(width < width_tmp) width = width_tmp;
			}

			$('#quiz_choices').css('width', width + 10 + 'px');

			$('#question_form').append($('<input>', {
				'type': 'submit',
				'id': 'quiz_button',
				'value': 'Submit'
			}));

			$("#question_form").submit(function(){
				if($("input[name='question_choice']:checked").val() == core.instructions[core.current]['correct']) quiz_answers.push(1);
				else quiz_answers.push(0);
				core.current++;
				core.display_prompt();
			});
		}
	}

	core.quiz_display();
	core.display_prompt();
};