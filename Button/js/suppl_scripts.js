var instruction_prompt = {
	instruction_list: [],
	next_step: function(){},
	list_length: 0,
	current: 0,

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
}

var tutorial = {
	instructions: 0,
	list_length: 0,
	current: 0,
	next_step: 0,

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
}