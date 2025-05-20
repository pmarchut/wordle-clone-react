import styles from './AppTile.module.scss'
import { ReactNode, useEffect, useState } from "react"

function AppTile({ children, small, ariaLabel, state, dataAnimation }: {
    children: ReactNode,
    small?: boolean,
    ariaLabel: string,
    state: string,
    dataAnimation?: string,
}) {
    const [currentAnimation, setCurrentAnimation] = useState(dataAnimation || "idle");
    const [ariaLive, setAriaLive] = useState<"off" | "assertive" | "polite" | undefined>(dataAnimation ? "polite" : "off");

    useEffect(() => {
        if (dataAnimation) {
            setCurrentAnimation(dataAnimation);
            setAriaLive("polite");
        }
    }, [dataAnimation]);

    const handleAnimationEnd = () => {
        if (currentAnimation === 'flip-in') {
            setCurrentAnimation('flip-out');
        } else {
            setCurrentAnimation('idle');
            setAriaLive('off');
        }
    };

    return (
        <div 
            className={`${small ? styles.small : ''} ${styles.tile}`}
            role="img"
            aria-roledescription="tile"
            aria-label={ariaLabel}
            data-state={state}
            data-animation={currentAnimation}
            data-testid="tile"
            aria-live={ariaLive}
            onAnimationEnd={handleAnimationEnd}
        >
            {children}
        </div>
    )
}

export default AppTile
