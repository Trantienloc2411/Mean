export default function Filter(props) {
  const { filterGroups, selectedValues, onFilterChange, onDateRangeChange } = props;

  return (
    <div style={{ padding: '16px', minWidth: '300px' }}>
      {filterGroups.map((group) => (
        <div key={group.name} style={{ marginBottom: '16px' }}>
          <h4>{group.title}</h4>
          <Checkbox.Group
            options={group.options.map((option) => ({
              ...option,
              label: (
                <span key={option.value}>
                  {option.label}
                </span>
              ),
              value: option.value,
              key: option.value, // Ensure each option has a unique key
            }))}
            value={selectedValues[group.name]}
            onChange={(checkedValues) => onFilterChange(group.name, checkedValues)}
          />
        </div>
      ))}

      <div>
        <h4>Khoảng thời gian</h4>
        <DatePicker.RangePicker
          style={{ width: '100%' }}
          onChange={onDateRangeChange}
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        />
      </div>
    </div>
  );
}
