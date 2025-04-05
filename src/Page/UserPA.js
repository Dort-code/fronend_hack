import { MainPredPA } from "./MainUserPA";
import { HederPredPA } from "./HederUserPA";

export function PredPA({ onLogout }) {
    return(
        <>
            <HederPredPA onLogout={onLogout} />
            <MainPredPA />
        </>
    );
}