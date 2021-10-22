var instruction_prompt = {
	instruction_list: [],
	next_step: function(){},
	list_length: 0,
	current: 0,

	run: function(input_list, input_next){
		this.current = 0;
		this.instruction_list = input_list;
		this.list_length = instruction_list.length;
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