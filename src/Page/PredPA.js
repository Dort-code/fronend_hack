import { MainPredPA } from "../components/Pred/MainPredPa";
import { HederPredPA } from "../components/Pred/HederPredPa";

export function PredPA({ onLogout }) {
    return(
        <>
            <HederPredPA onLogout={onLogout} />
            <MainPredPA />
        </>
    );
}