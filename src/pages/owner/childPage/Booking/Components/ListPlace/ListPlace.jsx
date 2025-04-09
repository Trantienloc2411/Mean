import { Button, Badge } from "antd"
import { EnvironmentOutlined, AimOutlined, AppstoreOutlined } from "@ant-design/icons"
import styles from "./ListPlace.module.scss"

export default function ListPlace({ locations = [], onSelectLocation, selectedLocation }) {
  const hasLocations = locations && locations.length > 0

  return (
    <div className={styles.listPlaceContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Địa Điểm</h2>
        <Badge count={locations.length} className={styles.locationCount} />
      </div>

      <div className={styles.locationList}>
        <Button
          onClick={() => onSelectLocation("all")}
          className={`${styles.locationButton} ${selectedLocation === "all" ? styles.activeButton : ""}`}
          icon={<AppstoreOutlined className={styles.locationIcon} />}
        >
          Tất Cả
        </Button>

        {hasLocations ? (
          locations.map((location) => {
            const locationId = location.rentalLocationId?._id || location._id
            const locationData = location.rentalLocationId || {}

            const locationName = locationData.name || "Địa điểm không xác định"
            const address = locationData.address || ""
            const ward = locationData.ward || ""
            const district = locationData.district || ""
            const city = locationData.city || ""

            return (
              <Button
                key={locationId}
                onClick={() => onSelectLocation(locationId)}
                className={`${styles.locationButton} ${selectedLocation === locationId ? styles.activeButton : ""}`}
                icon={<EnvironmentOutlined className={styles.locationIcon} />}
              >
                <div className={styles.locationContent}>
                  <span className={styles.locationName}>{locationName}</span>
                  <div className={styles.locationDetails}>
                    <div className={styles.addressLine}>{address}</div>
                    <div className={styles.addressLine}>
                      {ward}, {district}
                    </div>
                    <div className={styles.addressLine}>{city}</div>
                  </div>
                </div>
              </Button>
            )
          })
        ) : (
          <div className={styles.noLocations}>
            <AimOutlined className={styles.emptyIcon} />
            <p>Không có địa điểm nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
