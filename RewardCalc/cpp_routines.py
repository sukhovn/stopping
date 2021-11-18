import ctypes
import numpy.ctypeslib as ctl
import numpy as np
import os

cwd = os.getcwd()
if os.path.exists(cwd + "/../RewardCalc/routines_lib.so") == False:
	print("The library file routines_lib.so does not exist")
	print("Attempting to compile the library")
	if os.system("(cd " + cwd + "/../RewardCalc/; make)") != 0:
		print("Compilation failed")
	else:
		print("Compilation was successful")

lib=ctl.load_library('routines_lib.so', cwd + "/../RewardCalc/")

#Reward table function
reward_table_cpp = lib.reward_table
reward_table_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double]

def expected_reward_table(win_max, fail_max, time_max, **kwargs):
	prior = (1.0, 1.0)
	if 'prior' in kwargs:
		prior = kwargs['prior']

	val = np.zeros(win_max*fail_max*time_max, dtype=np.float64)
	reward_table_cpp(val, win_max, fail_max, time_max, prior[0], prior[1])
	val = val.reshape((time_max, win_max, fail_max))
	return val

#Transition table function
transition_table_cpp = lib.transition_table
transition_table_cpp.argtypes = [ctl.ndpointer(np.intc, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double]

def optimal_transition_table(win_max, fail_max, time_max, **kwargs):
	prior = (1.0, 1.0)
	if 'prior' in kwargs:
		prior = kwargs['prior']

	val = np.zeros(win_max*fail_max, dtype=np.intc)
	transition_table_cpp(val, win_max, fail_max, time_max, prior[0], prior[1])
	val = val.reshape((win_max, fail_max))
	return val

#Bernoulli trials function
run_bernoulli_trials_cpp = lib.run_bernoulli_trials
run_bernoulli_trials_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double, ctypes.c_double, ctypes.c_double]
# run_bernoulli_trials_cpp.restype = ctypes.c_double

def run_bernoulli_trials(time, num_tries, **kwargs):
	button_prior = (1.0, 1.0)
	policy_prior = (1.0, 1.0)
	if 'button_prior' in kwargs:
		button_prior = kwargs['button_prior']
	if 'policy_prior' in kwargs:
		policy_prior = kwargs['policy_prior']

	val = np.zeros(num_tries, dtype=np.float64)
	# theoretical_reward = run_bernoulli_trials_cpp(val, time, num_tries, button_prior[0], button_prior[1], policy_prior[0], policy_prior[1])
	# return (val, theoretical_reward)
	run_bernoulli_trials_cpp(val, time, num_tries, button_prior[0], button_prior[1], policy_prior[0], policy_prior[1])
	return val

#Fully recorded Bernoulli trial function
record_full_bernoulli_trials_cpp = lib.record_full_bernoulli_trials
record_full_bernoulli_trials_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double, ctypes.c_double, ctypes.c_double]
# record_full_bernoulli_trials_cpp.restype = ctypes.c_double

def record_full_bernoulli_trials(time, num_tries, **kwargs):
	button_prior = (1.0, 1.0)
	policy_prior = (1.0, 1.0)
	if 'button_prior' in kwargs:
		button_prior = kwargs['button_prior']
	if 'policy_prior' in kwargs:
		policy_prior = kwargs['policy_prior']

	val = np.zeros(num_tries*time*4, dtype=np.float64)
	# theoretical_reward = record_full_bernoulli_trials_cpp(val, time, num_tries, button_prior[0], button_prior[1], policy_prior[0], policy_prior[1])
	record_full_bernoulli_trials_cpp(val, time, num_tries, button_prior[0], button_prior[1], policy_prior[0], policy_prior[1])
	val = val.reshape((num_tries, time, 4))
	val[::,0:2] = np.rint(val[::,0:2])
	# return (val, theoretical_reward)
	return val

#Bernoulli with learning trials function
run_meta_bernoulli_trials_cpp = lib.run_meta_bernoulli_trials
run_meta_bernoulli_trials_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double, ctypes.c_double]

def run_meta_bernoulli_trials(time, num_tries, **kwargs):
	prior_k = 1.0
	button_prior = (1.0, 1.0)
	if 'button_prior' in kwargs:
		button_prior = kwargs['button_prior']
	if 'prior_k' in kwargs:
		prior_k = kwargs['prior_k']

	val = np.zeros(num_tries, dtype=np.float64)
	run_meta_bernoulli_trials_cpp(val, time, num_tries, button_prior[0], button_prior[1], prior_k)
	return val

#Fully recorded Bernoulli with learning trial function
record_full_meta_bernoulli_trials_cpp = lib.record_full_meta_bernoulli_trials
record_full_meta_bernoulli_trials_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double, ctypes.c_double]

def record_full_meta_bernoulli_trials(time, num_tries, **kwargs):
	prior_k = 1.0
	button_prior = (1.0, 1.0)
	if 'button_prior' in kwargs:
		button_prior = kwargs['button_prior']
	if 'prior_k' in kwargs:
		prior_k = kwargs['prior_k']

	val = np.zeros(num_tries*time*4, dtype=np.float64)
	record_full_meta_bernoulli_trials_cpp(val, time, num_tries, button_prior[0], button_prior[1], prior_k)
	val = val.reshape((num_tries, time, 4))
	val[::,0:2] = np.rint(val[::,0:2])
	return val

#Truncated Bernoulli trials

truncated_reward_table_cpp = lib.truncated_reward_table
truncated_reward_table_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_double]

def expected_truncated_reward_table(win_max, fail_max, time_max, **kwargs):
	truncation = 1.0
	if 'truncation' in kwargs:
		truncation = kwargs['truncation']

	val = np.zeros(win_max*fail_max*time_max, dtype=np.float64)
	truncated_reward_table_cpp(val, win_max, fail_max, time_max, truncation)
	val = val.reshape((time_max, win_max, fail_max))
	return val

truncated_transition_table_cpp = lib.truncated_transition_table
truncated_transition_table_cpp.argtypes = [ctl.ndpointer(np.intc, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_double]

def optimal_truncated_transition_table(win_max, fail_max, time_max, **kwargs):
	truncation = 0.9
	if 'truncation' in kwargs:
		truncation = kwargs['truncation']

	val = np.zeros(win_max*fail_max, dtype=np.intc)
	truncated_transition_table_cpp(val, win_max, fail_max, time_max, truncation)
	val = val.reshape((win_max, fail_max))
	return val

run_truncated_bernoulli_trials_cpp = lib.run_truncated_bernoulli_trials
run_truncated_bernoulli_trials_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double]

def run_truncated_bernoulli_trials(time, num_tries, **kwargs):
	button_truncation = 0.9
	policy_truncation = 0.9
	if 'button_truncation' in kwargs:
		button_truncation = kwargs['button_truncation']
	if 'policy_truncation' in kwargs:
		policy_truncation = kwargs['policy_truncation']

	val = np.zeros(num_tries, dtype=np.float64)
	run_truncated_bernoulli_trials_cpp(val, time, num_tries, button_truncation, policy_truncation)
	return val

record_full_truncated_bernoulli_trials_cpp = lib.record_full_truncated_bernoulli_trials
record_full_truncated_bernoulli_trials_cpp.argtypes = [ctl.ndpointer(np.float64, 
                                         flags='aligned, c_contiguous'), 
                           ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double]

def record_full_truncated_bernoulli_trials(time, num_tries, **kwargs):
	button_truncation = 0.9
	policy_truncation = 0.9
	if 'button_truncation' in kwargs:
		button_truncation = kwargs['button_truncation']
	if 'policy_truncation' in kwargs:
		policy_truncation = kwargs['policy_truncation']

	val = np.zeros(num_tries*time*4, dtype=np.float64)
	record_full_truncated_bernoulli_trials_cpp(val, time, num_tries, button_truncation, policy_truncation)
	val = val.reshape((num_tries, time, 4))
	val[::,0:2] = np.rint(val[::,0:2])
	return val