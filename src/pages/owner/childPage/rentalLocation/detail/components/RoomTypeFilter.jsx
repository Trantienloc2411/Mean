import { Button, Badge } from "antd"
import { AppstoreOutlined, HomeOutlined } from "@ant-design/icons"
import styles from "./RoomTypeFilter.module.scss"

export default function RoomTypeFilter({ roomTypes = [], onSelectRoomType, selectedRoomType }) {
  const hasRoomTypes = roomTypes && roomTypes.length > 0

  return (
    <div className={styles.roomTypeContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Loại Phòng</h2>
        <Badge count={roomTypes.length} className={styles.roomTypeCount} />
      </div>

      <div className={styles.roomTypeList}>
        <Button
          onClick={() => onSelectRoomType("all")}
          className={`${styles.roomTypeButton} ${selectedRoomType === "all" ? styles.activeButton : ""}`}
          icon={<AppstoreOutlined className={styles.roomTypeIcon} />}
        >
          Tất Cả
        </Button>

        {hasRoomTypes ? (
          roomTypes.map((roomType) => {
            const typeId = roomType._id
            const typeName = roomType.name || "Loại phòng không xác định"
            const maxPeople = roomType.maxPeopleNumber || 0
            const basePrice = roomType.basePrice || 0
            const hourlyPrice = roomType.overtimeHourlyPrice || 0
            const serviceCount = roomType.serviceIds?.length || 0

            return (
              <Button
                key={typeId}
                onClick={() => onSelectRoomType(typeId)}
                className={`${styles.roomTypeButton} ${selectedRoomType === typeId ? styles.activeButton : ""}`}
                icon={<HomeOutlined className={styles.roomTypeIcon} />}
              >
                <div className={styles.roomTypeContent}>
                  <span className={styles.roomTypeName}>{typeName}</span>
                  <div className={styles.roomTypeDetails}>
                    <div className={styles.detailLine}>Số người tối đa: {maxPeople}</div>
                    <div className={styles.detailLine}>Giá cơ bản: {basePrice.toLocaleString()} VND</div>
                    <div className={styles.detailLine}>Giá theo giờ: {hourlyPrice.toLocaleString()} VND/giờ</div>
                    <div className={styles.detailLine}>{serviceCount} dịch vụ</div>
                  </div>
                </div>
              </Button>
            )
          })
        ) : (
          <div className={styles.noRoomTypes}>
            <HomeOutlined className={styles.emptyIcon} />
            <p>Không có loại phòng nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
