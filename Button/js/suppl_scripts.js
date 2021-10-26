var instruction_prompt = {
	instruction_list: [],
	list_length: 0,
	current: 0,
	next_step: function(){},

	run: function(input_list, input_next){
		this.current = 0;
		this.instruction_list = input_list;
		this.list_length = input_list.length;
		this.next_step = input_next;
		this.display_prompt();
	},

	display_prompt: function(){
		if(this.current == this.list_length) this.next_step();
		else{
			$('body').html($('<div>', {
				'html': this.instruction_list[this.current],
				'id': 'instruction_screen'
			}));
			$(document).keyup(function(event) {
      			if(event.which === 13) {
        			$(document).off('keyup');
	        		instruction_prompt.display_prompt();
	        	}
			});
			this.current++;
		}
	}
};

var tutorial = {
	instructions: 0,
	list_length: 0,
	current: 0,
	next_step: function(){},

	run: function(tutorial_instructions, input_next){
		this.current = 0;
		this.instructions = tutorial_instructions;
		this.list_length = tutorial_instructions.length;
		this.next_step = input_next;
		this.display_prompt();
	},

	display_prompt: function(){
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
			let el_highlight = tutorial.instructions[tutorial.current]['highlight'];
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
		        		tutorial.display_prompt();
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
					tutorial.display_prompt();
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
					tutorial.display_prompt();
				});
			}
			this.current++;
		}
	}
};

var quiz = {
	message: 'This is a little quiz',
	instructions: 0,
	list_length: 0,
	current: 0,
	answers: [],
	next_step: function(){},

	run: function(quiz_instructions, input_next){
		this.current = 0;
		this.instructions = quiz_instructions;
		this.list_length = quiz_instructions.length;
		this.answers = [];
		this.next_step = input_next;
		this.quiz_display();
		this.display_prompt();
	},

	quiz_display: function(){
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
	},

	display_prompt: function(){
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
				if($("input[name='question_choice']:checked").val() == quiz.instructions[quiz.current]['correct']) quiz.answers.push(1);
				else quiz.answers.push(0);
				quiz.current++;
				quiz.display_prompt();
			});
		}
	}
};