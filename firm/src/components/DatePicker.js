const DatePicker = ({ value, onChange, name, className, minDate, maxDate }) => {
    const handleChange = (e) => {
      const newValue = e.target.value;
      const newDate = new Date(newValue);
  
      if (isNaN(newDate.getTime())) {
        //alert('Podano niepoprawną datę');
        return;
      }
  
      onChange({
        target: {
          name: name,
          value: newValue,
        },
      });
    };
  
    return (
      <input
        type="datetime-local"
        name={name}
        value={value}
        onChange={handleChange}
        className={className}
      />
    );
  };

export default DatePicker;