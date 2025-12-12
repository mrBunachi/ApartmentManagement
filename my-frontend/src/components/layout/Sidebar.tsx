export default function Sidebar() {
    return (
        <div style={{ width: 200, background: "#f3f3f3", height: "100vh" }}>
            <ul>
                <li><a href="/nhankhau">Nhân khẩu</a></li>
                <li><a href="/hokhau">Hộ khẩu</a></li>
                <li><a href="/donggop">Đóng góp</a></li>
                <li><a href="/dotthuphi">Đợt thu phí</a></li>
                <li><a href="/tamtru">Tạm trú</a></li>
                <li><a href="/tamvang">Tạm vắng</a></li>
            </ul>
        </div>
    );
}