#include <coef_calculator.h>
#include <iostream>
#include <cstring>
#include <timer.h>
#include <random>

#include <trial.h>
#include <bernoulli.h>

void run_table_generator(int argc, char const *argv[]){
	int win_max = 10, fail_max = 10, time_max = 100;
	double alpha_prior = 1.0, beta_prior = 1.0;

	for(int i = 1; i < argc; i++){
		if(strcmp(argv[i], "-wins") == 0){
			win_max = atoi(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-fails") == 0){
			fail_max = atoi(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-time") == 0){
			time_max = atoi(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-alpha") == 0){
			alpha_prior = atof(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-beta") == 0){
			beta_prior = atof(argv[i+1]);
			i++;
		}
	}

	Timer timer;
	Coefficient coef(win_max, fail_max, time_max, alpha_prior, beta_prior);
	timer.record();
	std::cout << "The calculation took " << timer.total << std::endl;
	std::cout << std::fixed;
	
	for(int i = 0; i < win_max; i++){
		for(int j = 0; j < fail_max; j++){
			std::cout << coef(time_max-1, i, j) << " ";
		}
		std::cout << std::endl;
	}

	return;
}

void run_bernoulli_trials(int argc, char const *argv[]){
	int time = 100, num_tries = 100;

	for(int i = 1; i < argc; i++){
		if(strcmp(argv[i], "-time") == 0){
			time = atoi(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-tries") == 0){
			num_tries = atoi(argv[i+1]);
			i++;
		}
	}

	Bernoulli_Button bb;

	// for(int tr = 0; tr < 10; tr++){
	// 	int success = 0;

	// 	if(bb.press_next_button() > 0.0) success++;
	// 	for (int i = 1; i < 1000; i++)
	// 		if(bb.press_current_button() > 0.0) success++;

	// 	double true_p = bb.print_probability();
	// 	std::cout << "Estimated probability " << success/1000.0 << '\n';
	// 	std::cout << "True probability " << true_p << "\n\n";
	// }

	Bernoulli_Policy plc(time);
	Policy_Test plc_test(&bb, &plc, time, num_tries);

	plc_test.run();
	std::cout << "Theoretical expected reward: " << plc.table(time-1, 0, 0) << std::endl;
	std::cout << "Experimental mean reward: " << plc_test.rewards_mean() << std::endl;
	std::cout << "Experimental reward deviation: " << plc_test.rewards_std() << std::endl;
	std::cout << "Experimental reward mean deviation: " << plc_test.rewards_std()/std::sqrt(1.0*num_tries) << std::endl;

	// plc.comments_on();
	// plc_test.single_run();
	// std::cout << plc_test.rewards_mean() << std::endl;

	return;
}

void run_biased_bernoulli_trials(int argc, char const *argv[]){
	int time = 100, num_tries = 100;
	double alpha_prior = 1.0, beta_prior = 1.0;

	for(int i = 1; i < argc; i++){
		if(strcmp(argv[i], "-time") == 0){
			time = atoi(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-tries") == 0){
			num_tries = atoi(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-alpha") == 0){
			alpha_prior = atof(argv[i+1]);
			i++;
		}
		if(strcmp(argv[i], "-beta") == 0){
			beta_prior = atof(argv[i+1]);
			i++;
		}
	}

	Biased_Bernoulli_Button bb(alpha_prior, beta_prior);

	Bernoulli_Policy plc(time, alpha_prior, beta_prior);
	Policy_Test plc_test(&bb, &plc, time, num_tries);

	plc_test.run();
	std::cout << "Theoretical expected reward: " << plc.table(time-1, 0, 0) << std::endl;
	std::cout << "Experimental mean reward: " << plc_test.rewards_mean() << std::endl;
	std::cout << "Experimental reward deviation: " << plc_test.rewards_std() << std::endl;
	std::cout << "Experimental reward mean deviation: " << plc_test.rewards_std()/std::sqrt(1.0*num_tries) << std::endl;

	return;
}

int main(int argc, char const *argv[]){
	// run_table_generator(argc, argv);
	// run_bernoulli_trials(argc, argv);
	run_biased_bernoulli_trials(argc, argv);

	return 0.0;
}