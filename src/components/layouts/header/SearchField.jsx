import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchField() {
  return (
    <Input
      size="large"
      placeholder="Tìm kiếm địa điểm cho thuê"
      prefix={<SearchOutlined />}
      style={{ maxWidth: 400 }}
    />
  );
}
