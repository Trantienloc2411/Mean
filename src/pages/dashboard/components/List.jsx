import { List } from "antd";
import {
    StarFilled
} from '@ant-design/icons';
/**
 * 
 * @param {string} itemLayout - will u place item 'vertically' or 'horizontally'
 * @param {Array} dataSource - data list of review (should be title, content, rating)
 * @param {Number} maxItem - show top (number) item in list
 * @returns 
 */

export default function ReviewList(props) {
    const {
        itemLayout,
        dataSource,
        maxItem = 0

    } = props;

    return (
        <List
            style={{
                backgroundColor: '#ffffff',
                padding: 20,
                borderRadius: 12,
                width: "100%", // Changed to take full width of container
            }}
            itemLayout={itemLayout}
            dataSource={maxItem < 1 ? dataSource : dataSource.slice(0,maxItem)}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        title={
                            <div style={{ fontWeight: "bold" }}>{item.title}</div>
                        }
                        description={<div>{item.content}</div>}
                    />
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 4 }}>{item.rating}</span>
                        <StarFilled style={{ color: "#FFD700" }} />
                    </div>
                </List.Item>
            )}
        />
    );
}