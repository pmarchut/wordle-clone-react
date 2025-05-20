import { useRef, useState, useEffect } from "react"
import styles from "./AppDropdown.module.scss"
import { showHelpDialog } from "@/stores/dialogsSlice";
import { useAppDispatch } from "@/stores/store";

function AppDropdown({ leftPosition, closeDropdown }: { 
  leftPosition: number
  closeDropdown: () => void
}) {
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const [isOpened, setIsOpened] = useState(false);

  function onHowToPlayClick() {
    dispatch(showHelpDialog());
    closeDropdown();
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpened) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const timer = setTimeout(() => setIsOpened(true), 100); // opóźnienie

    document.addEventListener("click", handleClickOutside);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpened, closeDropdown]);

  return (
    <ul
      ref={dropdownRef}
      role="menu" 
      className={`${styles.dropdown__menu} ${styles.wordle}`}
      style={{ left: `${leftPosition}px`, right: 'unset' }}
    >
      <li 
        role="none" 
        className={`${styles.dropdown__menuItem}`}
      >
          <button 
            type="button" 
            role="menuitem" 
            aria-haspopup="dialog"
            onClick={onHowToPlayClick}
          >
            How to Play
          </button>
      </li>
      <li 
        role="none" 
        className={`${styles.dropdown__menuItem}`}
      >
        <a 
          role="menuitem" 
          href="https://www.nytimes.com/2022/02/10/crosswords/best-wordle-tips.html" 
          target="_blank" 
          rel="noreferrer"
        >
          Tips and Tricks<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 16 16" width="16" className="game-icon" data-testid="icon-arrow"><path fill="var(--color-tone-1)" d="M11.3301 4.06982H4.73006V5.26982H9.88006L3.81006 11.3398L4.66006 12.1898L10.7301 6.11982V11.2698H11.9301V4.66982C11.9301 4.33982 11.6601 4.06982 11.3301 4.06982Z"></path></svg>
        </a>
      </li>
      <li 
        role="none" 
        className={`${styles.dropdown__menuItem}`}
      >
        <a 
          role="menuitem" 
          href="https://www.nytimes.com/2023/08/01/crosswords/how-to-talk-about-wordle.html" 
          target="_blank" 
          rel="noreferrer"
        >
          Glossary<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 16 16" width="16" className="game-icon" data-testid="icon-arrow"><path fill="var(--color-tone-1)" d="M11.3301 4.06982H4.73006V5.26982H9.88006L3.81006 11.3398L4.66006 12.1898L10.7301 6.11982V11.2698H11.9301V4.66982C11.9301 4.33982 11.6601 4.06982 11.3301 4.06982Z"></path></svg>
        </a>
      </li>
    </ul>
  )
}

export default AppDropdown
