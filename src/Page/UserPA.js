import { MainUserPA } from "../components/User/MainUserPA";
import { HederUserPA } from "../components/User/HederUserPA";

export function UserPA({ onLogout }) {
    return(
        <>
            <HederUserPA onLogout={onLogout} />
            <MainUserPA />
        </>
    );
}