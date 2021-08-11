#include <cstdio>
#include <cmath>

#ifndef COEF_CALCULATOR_H
#define COEF_CALCULATOR_H

class Coefficient{
	private:
		int win_max;
		int fail_max;
		int time_max;

		bool extern_reward_table;
		double *reward_table;
		double *iter_table;

		double mean_step_reward(int win, int fail){
			return 1.0*(win+1)/(1.0*(win+fail+2));
		}

		double success_transition_p(int win, int fail){
			return 1.0*(win+1)/(1.0*(win+fail+2));
		}

		void iter_table_prefill(){
			int row_space = fail_max+time_max;
			for(int i = 0; i < (win_max+time_max); i++){
				for(int j = 0; j < row_space; j++){
					iter_table[i*row_space+j] = mean_step_reward(i, j);
				}
			}
		}

		void iteration(int scope_alpha, int scope_beta){
			int row_space = fail_max+time_max;
			double success_p = success_transition_p(0, 0);
			double next_button_val = mean_step_reward(0, 0) + success_p*iter_table[row_space] + (1.0 - success_p)*iter_table[1];
			double stay_val;

			for(int i = 0; i < scope_alpha; i++){
				for(int j = 0; j < scope_beta; j++){
					success_p = success_transition_p(i, j);
					stay_val = mean_step_reward(i, j) + success_p*iter_table[(i+1)*row_space+j] + (1.0 - success_p)*iter_table[i*row_space+j+1];
					iter_table[i*row_space+j] = (stay_val > next_button_val ? stay_val : next_button_val);
				}
			}
		}

		void copy_to_reward_table(int time){
			int row_space = fail_max+time_max;
			double *reward_table_pnt = reward_table + time*win_max*fail_max;
			for(int i = 0; i < win_max; i++){
				for(int j = 0; j < fail_max; j++){
					*(reward_table_pnt++) = iter_table[i*row_space+j];
				}
			}
		}

	public:
		Coefficient(int win_init, int fail_init, int time_init): 
			win_max(win_init), fail_max(fail_init), time_max(time_init), extern_reward_table(false)
		{
			reward_table = new double[time_max*win_max*fail_max];
			iter_table = new double[(win_max+time_max)*(fail_max+time_max)];

			iter_table_prefill();
			copy_to_reward_table(0);
			for(int i = 1; i < time_max; i++){
				iteration(win_max+time_max-i-1, fail_max+time_max-i-1);
				copy_to_reward_table(i);
			}
		};

		Coefficient(double *reward_table_init, int win_init, int fail_init, int time_init): 
			win_max(win_init), fail_max(fail_init), time_max(time_init), 
			reward_table(reward_table_init), extern_reward_table(true)
		{
			iter_table = new double[(win_max+time_max)*(fail_max+time_max)];

			iter_table_prefill();
			copy_to_reward_table(0);
			for(int i = 1; i < time_max; i++){
				iteration(win_max+time_max-i-1, fail_max+time_max-i-1);
				copy_to_reward_table(i);
			}
		};

		~Coefficient(){
			if(!extern_reward_table) delete [] reward_table;
			delete [] iter_table;
		}

		double operator()(int time, int alpha, int beta) const{
			return reward_table[fail_max*(win_max*time + alpha) + beta];
		}
};

#endif