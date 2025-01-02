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

    const getCurrentDate = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; 
        const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        return localISOTime;
      };
  
    return (
      <input
        type="datetime-local"
        name={name}
        value={value || getCurrentDate()}
        onChange={handleChange}
        className={className}
      />
    );
  };

export default DatePicker;