import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [error, setError] = useState("");

  const onSubmit = () => {
    const ok = login(username, password);
    if (!ok) setError("Sai tài khoản hoặc mật khẩu");
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <input placeholder="Tên đăng nhập" onChange={(e) => setU(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" onChange={(e) => setP(e.target.value)} />
      <button onClick={onSubmit}>Đăng nhập</button>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
