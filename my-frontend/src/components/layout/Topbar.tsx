import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  const { logout } = useAuth();
  return (
    <div style={{ padding: 10, background: "#ddd" }}>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
