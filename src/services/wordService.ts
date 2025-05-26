let cachedWord: string | null = null;

export async function fetchWordList(): Promise<string[]> {
    try {
        const res = await fetch("/api/wordlist");
        const data = await res.json();
        const wordList = data?.word_pages[0]?.word_list;

        return wordList ? wordList.map((word: { word: string }) => word.word) : [];
    } catch (error) {
        console.error("Failed to fetch word list:", error);

        return [];
    }
}

// Losuje słowo i trzyma tylko w zamkniętej zmiennej
export async function initWord(wordList: string[]): Promise<void> {
    const index = crypto.getRandomValues(new Uint32Array(1))[0] % wordList.length;
    cachedWord = wordList[index].toUpperCase();
}

// Porównuje zgadywane słowo z ukrytym
export function checkGuess(guess: string): Array<'correct' | 'present' | 'absent'> {
    if (!cachedWord) throw new Error("Word not initialized");
    const guessLetters = guess.toUpperCase().split('');
    const targetLetters = cachedWord.split('');
    const result: Array<'correct' | 'present' | 'absent'> = Array(5).fill('absent');

    const used = Array(5).fill(false);
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = 'correct';
            used[i] = true;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (result[i] !== 'correct') {
            const idx = targetLetters.findIndex((l, j) => l === guessLetters[i] && !used[j]);
            if (idx !== -1) {
                result[i] = 'present';
                used[idx] = true;
            }
        }
    }

    return result;
}

export function getCachedWord(): string | null {
    return cachedWord;
}

export function checkIfInWordList(wordList: string[], guess: string) {
    return wordList.includes(guess.toLowerCase());
}
