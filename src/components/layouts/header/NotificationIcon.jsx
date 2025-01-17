import { BellFilled } from "@ant-design/icons";
import { Badge, Button } from "antd";

export default function NotificationIcon({ count, onClick }) {
  return (
    <Badge count={count}>
      <Button
        size="large"
        type="text"
        icon={
          <BellFilled
            style={{
              background: "#d6d9dd",
              fontSize: 20,
              color: "#333",
              borderRadius: 30,
              padding: 11,
            }}
          />
        }
        onClick={onClick} // Gọi hàm onClick khi nhấn vào icon
      />
    </Badge>
  );
}
