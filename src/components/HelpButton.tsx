import { useRef, useState } from "react"
import styles from "./ToolbarShared.module.scss"
import AppDropdown from "./AppDropdown";

function HelpButton() {
    const helpButton = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [leftPosition, setLeftPosition] = useState(0);

    const dropdownWidth = 178;

    const toggleMenu = () => {
        if (!isOpen) {
            setIsOpen(true);
            if (helpButton?.current) {
                const rect = helpButton.current.getBoundingClientRect();
                setLeftPosition(rect.left + rect.width - dropdownWidth);
            } 
        }
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <button 
                ref={helpButton}
                type="button" 
                className={`${styles.toolbar_item} ${styles.toolbarColors}`}
                id="help-button" 
                data-testid="help-button" 
                aria-label="Help" 
                aria-haspopup="menu" 
                aria-expanded={isOpen ? 'true' : 'false'}
                onClick={toggleMenu}
            >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 32 32" width="32" className="game-icon" data-testid="icon-help">
                    <path fill="var(--color-tone-1)" d="M15 24H17.6667V21.3333H15V24ZM16.3333 2.66666C8.97333 2.66666 3 8.63999 3 16C3 23.36 8.97333 29.3333 16.3333 29.3333C23.6933 29.3333 29.6667 23.36 29.6667 16C29.6667 8.63999 23.6933 2.66666 16.3333 2.66666ZM16.3333 26.6667C10.4533 26.6667 5.66667 21.88 5.66667 16C5.66667 10.12 10.4533 5.33332 16.3333 5.33332C22.2133 5.33332 27 10.12 27 16C27 21.88 22.2133 26.6667 16.3333 26.6667ZM16.3333 7.99999C13.3867 7.99999 11 10.3867 11 13.3333H13.6667C13.6667 11.8667 14.8667 10.6667 16.3333 10.6667C17.8 10.6667 19 11.8667 19 13.3333C19 16 15 15.6667 15 20H17.6667C17.6667 17 21.6667 16.6667 21.6667 13.3333C21.6667 10.3867 19.28 7.99999 16.3333 7.99999Z"></path>
                </svg>
            </button>
            
            {isOpen && 
            <AppDropdown 
                leftPosition={leftPosition}
                closeDropdown={closeDropdown}
            />}
        </div>
    )
}

export default HelpButton
