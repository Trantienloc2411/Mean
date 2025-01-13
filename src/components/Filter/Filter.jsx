import { Checkbox } from 'antd';
import styles from './Filter.module.scss';
/**
 * FilterModify Component
 * 
 * A flexible and reusable filter component that supports multiple filter groups with checkbox selections.
 * Each filter group is displayed in its own column and can have custom options with tags or other elements.
 * 
 * @component
 * 
 * Props:
 * @param {Object[]} filterGroups - Array of filter group configurations
 * @param {string} filterGroups[].name - Unique identifier for the filter group
 * @param {string} filterGroups[].title - Display title for the filter group
 * @param {Object[]} filterGroups[].options - Array of options for the filter group
 * @param {ReactNode} filterGroups[].options[].label - Display element for the option
 * @param {string} filterGroups[].options[].value - Value for the option
 * 
 * @param {Object} selectedValues - Object containing selected values for each filter group
 * @param {function} onFilterChange - Callback function when filters change (groupName, newValues) => void
 * 
 * Example Usage:
 * 
 * const filterGroups = [
 *   {
 *     name: 'status',
 *     title: 'Status',
 *     options: [
 *       {
 *         label: <Tag color="green">Active</Tag>,
 *         value: 'active'
 *       },
 *       {
 *         label: <Tag color="red">Inactive</Tag>,
 *         value: 'inactive'
 *       }
 *     ]
 *   },
 *   {
 *     name: 'type',
 *     title: 'Type',
 *     options: [
 *       {
 *         label: <Tag>Type A</Tag>,
 *         value: 'typeA'
 *       },
 *       {
 *         label: <Tag>Type B</Tag>,
 *         value: 'typeB'
 *       }
 *     ]
 *   }
 * ];
 * 
 * const [selectedValues, setSelectedValues] = useState({
 *   status: [],
 *   type: []
 * });
 * 
 * const handleFilterChange = (filterName, newValues) => {
 *   setSelectedValues(prev => ({
 *     ...prev,
 *     [filterName]: newValues
 *   }));
 * };
 * 
 * <FilterModify
 *   filterGroups={filterGroups}
 *   selectedValues={selectedValues}
 *   onFilterChange={handleFilterChange}
 * />
 */
export default function Filter(props) {
    const {
        filterGroups,
        selectedValues,
        onFilterChange
    } = props;

    return (
        <div
            className={styles.filterContainer}
            style={{
                gridTemplateColumns: `repeat(${filterGroups.length}, 1fr)`
            }}
        >
            {filterGroups.map((group, index) => (
                <div
                    key={group.name}
                    className={styles.filterGroup}
                >
                    <h4>{group.title}</h4>
                    <Checkbox.Group
                        className={styles.checkboxGroup}
                        options={group.options}
                        value={selectedValues[group.name]}
                        onChange={(checkedValues) => onFilterChange(group.name, checkedValues)}
                    />
                </div>
            ))}
        </div>
    );
} 