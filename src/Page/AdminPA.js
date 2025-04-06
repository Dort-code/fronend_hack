import {HederAdminPA} from "./HederAdminPA";
import {MainAdminPA} from "./MainAdminPA";

export function AdminPA({onLogout}) {
    return(
        <>
            <HederAdminPA onLogout={onLogout} />
            <MainAdminPA />
        </>
    );
}