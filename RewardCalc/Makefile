.PHONY: all clean

TRIAL_DIR = Trial
TRIAL_SRC := $(wildcard $(TRIAL_DIR)/*.cpp)
TRIAL_BINS := $(patsubst $(TRIAL_DIR)/%.cpp, obj/trial/%.o, $(TRIAL_SRC))

HEAD_FOLDERS = $(TRIAL_DIR) 
HEAD_LINK = $(patsubst %, -I%, $(HEAD_FOLDERS))

CC = g++ # compiler to use
CFLAGS = -c -g -O3 -I. $(HEAD_LINK) # flags to use at compliation
LINKERFLAG = -lm

all: obj $(TRIAL_BINS) obj/run.o
	${CC} -o run $(TRIAL_BINS) obj/run.o ${LINKERFLAG}

obj:
	@echo "Making obj directory..."
	mkdir obj
	mkdir obj/trial

obj/run.o: run.cpp
	@echo "Compiling run.cpp..."
	${CC} ${CFLAGS} -o obj/run.o run.cpp

clean:
	@echo "Cleaning up..."
	rm -rvf obj
	rm run