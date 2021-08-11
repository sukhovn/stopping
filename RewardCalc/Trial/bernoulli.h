#include <trial.h>
#include <coef_calculator.h>

#ifndef BERNOULLI_H
#define BERNOULLI_H

class Bernoulli_Button: public Button{
private:
	//Random number generator variables
	std::random_device rand_dev;	//Will be used to obtain a seed for the random number engine
	std::mt19937 generator; //Standard mersenne_twister_engine seeded with rd()
	std::uniform_real_distribution<> distr;

	double bernoulli_p;
	double reward;

public:
	void new_button(){
		bernoulli_p = distr(generator);
	}

	double print_probability(){
		std::cout << "Warning! Bernoulli button probability inquiry\n";
		return bernoulli_p;
	}

	double press_current_button(){
		double thrw = distr(generator);
		if(thrw < bernoulli_p) return reward;
		else return 0.0;
	}

	Bernoulli_Button(double reward_init = 1.0): reward(reward_init), rand_dev(), generator(rand_dev()), distr(0.0, 1.0){
		new_button();
	}
};

class Bernoulli_Policy: public Policy{
private:
	int alpha;
	int beta;
	int time;
	int time_left;

	bool comments;

	Coefficient expect_coeff;

public:
	const Coefficient &table;

	Bernoulli_Policy(int time_init): alpha(1), beta(1), 
		time(time_init), time_left(time_init), expect_coeff(time, time, time), table(expect_coeff), comments(false) {};
	
	void reset(){time_left = time; alpha = 1; beta = 1;}
	void comments_on(){comments = true;}

	bool change_button(double reward){
		if(reward > 0.0) alpha++;
		else beta++;
		time_left--;

		if(time_left == 0) return false;
		
		if(time_left > 1){
			double change_val = expect_coeff(time_left-1, 0, 0);
			double p_win = 1.0*alpha/(1.0*(alpha+beta));
			double stay_val = p_win + p_win*expect_coeff(time_left-2, alpha, beta-1) + (1 - p_win)*expect_coeff(time_left-2, alpha-1, beta);

			if(comments){
				std::cout << "Reward " << reward << " received\n";
				std::cout << "The remaining number of presses is: " << time_left << "\n";
				std::cout << "The current numbers of successes and fails: (" << alpha-1 << ", " << beta-1 << ")\n";
				std::cout << "Expected rewards when staying and leaving are: (" << stay_val << ", " << change_val << ")\n";
				if(change_val > stay_val) std::cout << "The optimal solution is to change\n\n";
				else std::cout << "The optimal solution is to stay\n\n"; 
			}

			if(change_val > stay_val){
				alpha = beta = 1;
				return true;
			}
			else return false;
		}
		else{
			if(comments){
				std::cout << "Reward " << reward << " received\n";
				std::cout << "The remaining number of presses is: 1\n";
				std::cout << "The current numbers of successes and fails: (" << alpha-1 << ", " << beta-1 << ")\n";
				std::cout << "Expected rewards when staying and leaving are: (" << 1.0*alpha/(1.0*(alpha+beta)) << ", 0.5)\n";
				if(1.0*alpha/(1.0*(alpha+beta)) < 0.5) std::cout << "The optimal solution is to change\n\n";
				else std::cout << "The optimal solution is to stay\n\n"; 
			}

			double p_stay = 1.0*alpha/(1.0*(alpha+beta));
			if(p_stay < 0.5){
				alpha = beta = 1;
				return true;
			}
			else return false;
		}
	}
};

#endif