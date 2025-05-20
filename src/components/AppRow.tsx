import styles from "./AppRow.module.scss"
import AppTile from "@/components/AppTile"
import { BoardLetter } from "@/types";

function AppRow(props: {
    ariaLabel: string;
    word?: string;
    wordCheckResults: string[];
    invalid?: boolean;
}) {
    const getLetter = (index: number): BoardLetter => {
        const letterAtIndex = props.word ? props.word[index] : undefined;
    
        if (letterAtIndex) {
          const result = props.wordCheckResults[index] || "tbd";
          return {
            letter: letterAtIndex,
            ariaLabel: props.wordCheckResults[index] ? `${letterAtIndex}, ${result}` : letterAtIndex,
            state: result,
            dataAnimation: props.wordCheckResults[index] ? "flip-in" : "pop"
          };
        } else {
          return {
            letter: "",
            ariaLabel: "empty",
            state: "empty",
            dataAnimation: undefined
          };
        }
    };

    const ordinals = ["1st", "2nd", "3rd", "4th", "5th"];

    return (
        <div className={`${styles.row} ${props.invalid ? styles.invalid : ''}`} role="group" aria-label={props.ariaLabel} data-testid={props.ariaLabel}>
            {Array.from({ length: 5 }, (_, i) => {
                const tileProps = getLetter(i);
                return (
                    <AppTile
                        key={i}
                        {...tileProps}
                        ariaLabel={`${ordinals[i]} letter, ${tileProps.ariaLabel}`}
                    >
                        {tileProps.letter}
                    </AppTile>
                );
            })}
        </div>
    );
}

export default AppRow
