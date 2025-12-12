import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";


export default function AdminLayout() {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Topbar />
                <div style={{ padding: 20 }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}