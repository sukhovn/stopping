#include <iostream>
#include <iomanip>
#include <string>

#ifndef PRINT_LATEX_H
#define PRINT_LATEX_H

template <class T>
class Print_Table{
private:
	int nrows;
	int ncols;
	T *table;
	std::string ending;

public:
	Print_Table(T *tablei, int nrowsi, int ncolsi, std::string end): nrows(nrowsi), ncols(ncolsi), table(tablei), ending(end) {};
	
	template <class Ti>
	friend std::ostream& operator<<(std::ostream& os, Print_Table <Ti> prnt);
};

template <class T>
std::ostream& operator<<(std::ostream& os, Print_Table<T> prnt){
	T tmp;
	for(int i = 0; i < prnt.nrows; i++){
		os << i << " & ";
		for(int j = 0; j < prnt.ncols-1; j++){
			tmp = prnt.table[i*prnt.ncols+j];
			if(tmp == 0) os << "n/a & ";
			else os << tmp << " & ";
		}
		os << prnt.table[i*prnt.ncols+prnt.ncols-1] << prnt.ending << std::endl;

	}
	return os;
}

#endif