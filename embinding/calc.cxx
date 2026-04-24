#include <emscripten/bind.h>

int computeFibonacci(int n) {
    if (n <= 1) return n;
    return computeFibonacci(n-1) + computeFibonacci(n-2);
}

int countPrime(int limit) {
    if (limit < 2) return 0;
    std::vector<char> sieve(limit, 1);
    size_t memUsed = limit * sizeof(char); // measured while alive

    int count = 0;
    for (int i = 2; i < limit; i++) {
        if (sieve[i]) {
            count++;
            for (int j = i*2; j < limit; j += i)
                sieve[j] = false;
        }
    }
    return count;
}

EMSCRIPTEN_BINDINGS(calc) {
    emscripten::function("computeFibonacci", &computeFibonacci);
    emscripten::function("countPrime", &countPrime);
}
