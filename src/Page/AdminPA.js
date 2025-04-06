import {HederAdminPA} from "../components/Admin/HederAdminPA";
import {MainAdminPA} from "../components/Admin/MainAdminPA";

export function AdminPA({onLogout}) {
    return(
        <>
            <HederAdminPA onLogout={onLogout} />
            <MainAdminPA />
        </>
    );
}