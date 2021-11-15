#include <iostream>
#include <cstring>
#include <timer.h>
#include <random>

#include <reward_calculator.h>
#include <transition_calculator.h>

#include <trial.h>
#include <bernoulli.h>
#include <meta_bernoulli.h>
#include <truncated_bernoulli.h>

// This function is used when expected_reward_table is called in Python
extern "C" void reward_table(double *table, int win_max, int fail_max, int time_max, double alpha_prior, double beta_prior)
{
	Bernoulli_Reward coef(table, win_max, fail_max, time_max, alpha_prior, beta_prior);

	return;
}

// This function is used when expected_reward_table is called in Python
extern "C" void transition_table(int *table, int win_max, int fail_max, int time_max, double alpha_prior, double beta_prior)
{
	Bernoulli_Transition trans(table, win_max, fail_max, time_max, alpha_prior, beta_prior);

	return;
}

// This function is used when run_bernoulli_trials is called in Python
// It returns the rewards over num_tries runs and theoretical expected reward
extern "C" void run_bernoulli_trials(double *rewards, int time, int num_tries, double button_a_prior, double button_b_prior, double policy_a_prior, double policy_b_prior)
{
	Biased_Bernoulli_Button bbb(button_a_prior, button_b_prior);

	Bernoulli_Policy_Direct plc(time, policy_a_prior, policy_b_prior);
	Policy_Test plc_run(&bbb, &plc, time, num_tries);

	for(int i = 0; i < num_tries; i++){
		rewards[i] = plc_run.single_run();
	}

	// return plc.table(time-1, 0, 0);
}

extern "C" void record_full_bernoulli_trials(double *rewards, int time, int num_tries, double button_a_prior, double button_b_prior, double policy_a_prior, double policy_b_prior)
{
	double *rewards_tmp = rewards;

	Biased_Bernoulli_Button bbb(button_a_prior, button_b_prior);

	Bernoulli_Policy_Direct plc(time, policy_a_prior, policy_b_prior);
	Single_Policy_Run plc_run(&bbb, &plc, time);

	for(int i = 0; i < num_tries; i++){
		plc_run.single_run(rewards_tmp);
		rewards_tmp += 4*time;
	}

	// return plc.table(time-1, 0, 0);
}


// These functions implement the same routines as above for Bernoulli trials with distribution meta learning
extern "C" void run_meta_bernoulli_trials(double *rewards, int time, int num_tries, double button_a_prior, double button_b_prior, double prior_k)
{
	Biased_Bernoulli_Button bbb(button_a_prior, button_b_prior);

	Meta_Bernoulli_Policy plc(time, prior_k);
	Policy_Test plc_run(&bbb, &plc, time, num_tries);

	for(int i = 0; i < num_tries; i++){
		rewards[i] = plc_run.single_run();
	}
}

extern "C" void record_full_meta_bernoulli_trials(double *rewards, int time, int num_tries, double button_a_prior, double button_b_prior, double prior_k)
{
	double *rewards_tmp = rewards;

	Biased_Bernoulli_Button bbb(button_a_prior, button_b_prior);

	Meta_Bernoulli_Policy plc(time, prior_k);
	Single_Policy_Run plc_run(&bbb, &plc, time);

	for(int i = 0; i < num_tries; i++){
		plc_run.single_run(rewards_tmp);
		rewards_tmp += 4*time;
	}
}

// These functions implement the same routines as above for Bernoulli trials with probability truncated from the above

extern "C" void truncated_reward_table(double *table, int win_max, int fail_max, int time_max, double trunc_high)
{
	Truncated_Bernoulli_Reward coef(table, win_max, fail_max, time_max, trunc_high);

	return;
}

extern "C" void truncated_transition_table(int *table, int win_max, int fail_max, int time_max, double trunc_high)
{
	Truncated_Bernoulli_Transition trans(table, win_max, fail_max, time_max, trunc_high);

	return;
}

extern "C" void run_truncated_bernoulli_trials(double *rewards, int time, int num_tries, double trunc_button, double trunc_policy)
{
	Truncated_Bernoulli_Button tbb(trunc_button);

	Truncated_Bernoulli_Policy plc(time, trunc_policy);
	Policy_Test plc_run(&tbb, &plc, time, num_tries);

	for(int i = 0; i < num_tries; i++){
		rewards[i] = plc_run.single_run();
	}
}

extern "C" void record_full_truncated_bernoulli_trials(double *rewards, int time, int num_tries, double trunc_button, double trunc_policy)
{
	double *rewards_tmp = rewards;

	Truncated_Bernoulli_Button tbb(trunc_button);

	Truncated_Bernoulli_Policy plc(time, trunc_policy);
	Single_Policy_Run plc_run(&tbb, &plc, time);

	for(int i = 0; i < num_tries; i++){
		plc_run.single_run(rewards_tmp);
		rewards_tmp += 4*time;
	}
}