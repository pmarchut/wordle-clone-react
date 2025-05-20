import styles from "./GameKeyboard.module.scss"
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { enterLetter, handleBackspace, handleEnter, selectCanBackspace, selectCanSubmit } from '@/stores/guessesSlice';
import AppKey from '@/components/AppKey';

let lastInputWasKeyboard = false;

const GameKeyboard = () => {
  const dispatch = useAppDispatch();
  const guesses = useAppSelector((state) => state.guesses);
  const canSubmit = useAppSelector(selectCanSubmit);
  const canBackspace = useAppSelector(selectCanBackspace);
  const wordleOnscreenInputOnly = localStorage.getItem('wordle-onscreen-input-only') === 'true';

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (wordleOnscreenInputOnly || guesses.ended) return;

      const key = e.key;

      //test
      // console.log('key:', key);
      // console.log('inside keyboard?', document.getElementById('game-keyboard')?.contains(document.activeElement));

      if (
        key === 'Enter' &&
        document.activeElement instanceof HTMLElement &&
        document.getElementById('game-keyboard')?.contains(document.activeElement)
      ) {
        //test
        // console.log(`key ${key} ignored`)
        return; // ignoruj Enter, jeśli focus jest na przycisku klawiatury
      }

      if (/^[a-zA-Z]$/.test(key)) {
        dispatch(enterLetter(key.toUpperCase()));
      } else if (key === 'Enter') {
        dispatch(handleEnter());
      } else if (key === 'Backspace') {
        dispatch(handleBackspace());
      }
    },
    [dispatch, guesses.ended, wordleOnscreenInputOnly]
  );

  useEffect(() => {
    const handleGlobalKeydown = () => {
      lastInputWasKeyboard = true;
    };

    const handleGlobalMousedown = () => {
      lastInputWasKeyboard = false;
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keydown', handleGlobalKeydown, true);
    window.addEventListener('mousedown', handleGlobalMousedown, true);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keydown', handleGlobalKeydown, true);
      window.removeEventListener('mousedown', handleGlobalMousedown, true);
    };
  }, [handleKeydown]);

  const handleEnterLetter = (e: React.MouseEvent, letter: string) => {
    if (!guesses.ended) {
      dispatch(enterLetter(letter));
    }

    if (
      !lastInputWasKeyboard &&
      e.currentTarget instanceof HTMLElement
    ) {
      e.currentTarget.blur();
    }
  };

  const getKeyProps = (key: string) => {
    const letter = key.toUpperCase();
    let status: 'correct' | 'present' | 'absent' | undefined;

    for (let row = 0; row < guesses.checkResults.length; row++) {
      for (let col = 0; col < guesses.checkResults[row].length; col++) {
        const result = guesses.checkResults[row][col];
        const guessedLetter = guesses.guesses[row]?.[col];

        if (guessedLetter === letter) {
          if (result === 'correct') {
            status = 'correct';
            break;
          } else if (result === 'present' && status !== 'correct') {
            status = 'present';
          } else if (result === 'absent' && !status) {
            status = 'absent';
          }
        }
      }
      if (status === 'correct') break;
    }

    return status
      ? { ariaLabel: `${key} ${status}`, dataState: status }
      : { ariaLabel: `add ${key}`, dataState: undefined };
  };

  const keys = {
    row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  };

  return (
    <div id="game-keyboard" className={`${styles.keyboard}`} role="group" aria-label="Keyboard">
      <div className={`${styles.row}`}>
        {keys.row1.map((key) => (
          <AppKey
            key={key}
            data-key={key}
            ariaDisabled={guesses.ended}
            data-testid={`key-${key}`}
            onClick={(e: React.MouseEvent) => handleEnterLetter(e, key.toUpperCase())}
            {...getKeyProps(key)}
          >
            {key}
          </AppKey>
        ))}
      </div>
      <div className={`${styles.row}`}>
        {keys.row2.map((key) => (
          <AppKey
            key={key}
            data-key={key}
            ariaDisabled={guesses.ended}
            spacerBefore={key === 'a'}
            spacerAfter={key === 'l'}
            data-testid={`key-${key}`}
            onClick={(e: React.MouseEvent) => handleEnterLetter(e, key.toUpperCase())}
            {...getKeyProps(key)}
          >
            {key}
          </AppKey>
        ))}
      </div>
      <div className={`${styles.row}`}>
        <AppKey
          data-key="↵"
          ariaLabel="enter"
          ariaDisabled={!canSubmit}
          oneAndAHalf
          data-testid="enter-button"
          onClick={() => !guesses.ended && dispatch(handleEnter())}
        >
          enter
        </AppKey>
        {keys.row3.map((key) => (
          <AppKey
            key={key}
            data-key={key}
            ariaDisabled={guesses.ended}
            data-testid={`key-${key}`}
            onClick={(e: React.MouseEvent) => handleEnterLetter(e, key.toUpperCase())}
            {...getKeyProps(key)}
          >
            {key}
          </AppKey>
        ))}
        <AppKey
          data-key="←"
          ariaLabel="backspace"
          ariaDisabled={!canBackspace}
          oneAndAHalf
          data-testid="backspace-button"
          onClick={() => !guesses.ended && dispatch(handleBackspace())}
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" className="game-icon" data-testid="icon-backspace"><path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>
        </AppKey>
      </div>
    </div>
  );
};

export default GameKeyboard;
