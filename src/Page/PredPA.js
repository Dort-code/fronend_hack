import { MainPredPA } from "./MainPredPa";
import { HederPredPA } from "./HederPredPa";

export function PredPA({ onLogout }) {
    return(
        <>
            <HederPredPA onLogout={onLogout} />
            <MainPredPA />
        </>
    );
}