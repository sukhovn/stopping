#include <cstdio>
#include <cmath>
#include <vector>
#include <random>

#ifndef TRIAL_H
#define TRIAL_H

class Button{
public:
	virtual void new_button() = 0;

	virtual double press_current_button() = 0;
	double press_next_button()
	{
		new_button();
		return press_current_button();
	}
};

class Policy{
public:
	virtual void reset() = 0;
	virtual bool change_button(double reward) = 0;
};

class Policy_Test{
private:
	int time;
	int run_times;

public:
	Button *btn;
	Policy *pol;
	std::vector<double> rewards;

	Policy_Test(Button *btn_init, Policy *pol_init, int time_init, int run_times_init):
		btn(btn_init), pol(pol_init), time(time_init), run_times(run_times_init), rewards() {};

	double single_run(){
		double reward_curr;
		double reward_acc = 0.0;
		bool change_button = true;

		btn->new_button();
		pol->reset();
		for(int i = 0; i < time; i++){
			if(change_button) reward_curr = btn->press_next_button();
			else reward_curr = btn->press_current_button();
			change_button = pol->change_button(reward_curr);
			reward_acc += reward_curr;
		}

		rewards.push_back(reward_acc);
		return reward_acc;
	}

	void run(){
		for(int i = 0; i < run_times; i++) single_run();
	}

	double rewards_mean(){
		double tmp = 0.0;
		for(int i = 0; i < rewards.size(); i++) tmp += rewards[i]; 
		return tmp/(1.0*rewards.size());
	}

	double rewards_std(){
		double tmp = 0;
		double mean = rewards_mean();
		for(int i = 0; i < rewards.size(); i++) tmp += std::pow(rewards[i] - mean, 2.0); 
		double nminus = (double) rewards.size()-1;

		return std::sqrt(tmp/nminus);
	}
};

#endif