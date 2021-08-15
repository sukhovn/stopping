.PHONY: all clean

TRIAL_DIR = Trial
TRIAL_SRC := $(wildcard $(TRIAL_DIR)/*.cpp)
TRIAL_BINS := $(patsubst $(TRIAL_DIR)/%.cpp, obj/trial/%.o, $(TRIAL_SRC))

HEAD_FOLDERS = $(TRIAL_DIR) 
HEAD_LINK = $(patsubst %, -I%, $(HEAD_FOLDERS))

CC = g++ # compiler to use
CFLAGS = -c -g -O3 -I. $(HEAD_LINK) # flags to use at compliation
LINKERFLAG = -lm

all: obj $(TRIAL_BINS) obj/run.o obj/routines_lib.o 
	${CC} -o run $(TRIAL_BINS) obj/run.o ${LINKERFLAG}
	${CC} -shared -o routines_lib.so $(TRIAL_BINS) obj/routines_lib.o ${LINKERFLAG}

obj:
	@echo "Making obj directory..."
	mkdir obj
	mkdir obj/trial

obj/run.o: run.cpp
	@echo "Compiling run.cpp..."
	${CC} ${CFLAGS} -o obj/run.o run.cpp

obj/routines_lib.o: routines_lib.cpp
	@echo "Compiling routines_lib.cpp..."
	${CC} ${CFLAGS} -fpic -o obj/routines_lib.o routines_lib.cpp

clean:
	@echo "Cleaning up..."
	rm -rvf obj
	rm run
	rm routines_lib.so