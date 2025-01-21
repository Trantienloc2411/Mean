export default function Tag(props) {
    const {
        text = "Đang hoạt động",
        textColor,
        textBackground
    } = props;

    return (
        <div
            style={{
                display: "flex",
                backgroundColor: textBackground,
                padding: "6px 8px",
                borderRadius: 20,
                justifyContent: "center",
                minHeight: 10
            }}
        >
            <span style={{ color: textColor }}>{text}</span>
        </div>
    );
}
