import {HederAdminPA} from "./HederAdminPA";

export function AdminPA({onLogout}) {
    return(
        <>
            <HederAdminPA onLogout={onLogout} />
        </>
    );
}