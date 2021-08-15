#include <coef_calculator.h>
#include <iostream>
#include <cstring>
#include <timer.h>
#include <random>

#include <trial.h>
#include <bernoulli.h>

// This function is used when expected_reward_table is called in Python
extern "C" void reward_table(double *table, int win_max, int fail_max, int time_max, double alpha_prior, double beta_prior)
{
	Coefficient coef(table, win_max, fail_max, time_max, alpha_prior, beta_prior);

	return;
}

// This function is used when run_bernoulli_trials is called in Python
// It returns the rewards over num_tries runs and theoretical expected reward
extern "C" double run_bernoulli_trials(double *rewards, int time, int num_tries, double button_a_prior, double button_b_prior, double policy_a_prior, double policy_b_prior)
{
	Biased_Bernoulli_Button bbb(button_a_prior, button_b_prior);

	Bernoulli_Policy plc(time, policy_a_prior, policy_b_prior);
	Policy_Test plc_run(&bbb, &plc, time, num_tries);

	for(int i = 0; i < num_tries; i++){
		rewards[i] = plc_run.single_run();
	}

	return plc.table(time-1, 0, 0);
}

extern "C" double record_full_bernoulli_trials(double *rewards, int time, int num_tries, double button_a_prior, double button_b_prior, double policy_a_prior, double policy_b_prior)
{
	double *rewards_tmp = rewards;

	Biased_Bernoulli_Button bbb(button_a_prior, button_b_prior);

	Bernoulli_Policy plc(time, policy_a_prior, policy_b_prior);
	Single_Bernoulli_Run plc_run(&bbb, &plc, time);

	for(int i = 0; i < num_tries; i++){
		plc_run.single_run(rewards_tmp);
		rewards_tmp += 4*time;
	}

	return plc.table(time-1, 0, 0);
}
