import { MainUserPA } from "./MainUserPA";
import { HederUserPA } from "./HederUserPA";

export function UserPA({ onLogout }) {
    return(
        <>
            <HederUserPA onLogout={onLogout} />
            <MainUserPA />
        </>
    );
}