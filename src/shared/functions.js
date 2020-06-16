export const getCurrentTime = (utcTime, timeZoneStr) => {
    const offsetSign = timeZoneStr.slice(0, 1);
    const offsetHr = parseInt(timeZoneStr.slice(1, 3));
    const offsetMin = parseInt(timeZoneStr.slice(-2));
  
    const utcHr = parseInt(utcTime.split(/:/)[0]);
    const utcMin = parseInt(utcTime.split(/:/)[1]);
  
    let hr = 0;
    let min = 0;
  
    if (offsetSign === '+'){
      hr = ((utcHr + offsetHr) % 24).toString();
      min = ((utcMin + offsetMin) % 60).toString();
    }else{
      if ((utcHr - offsetHr) < 0) {
        hr = ((24 + utcHr - offsetHr) % 24).toString();
      }else{
        hr = ((utcHr -offsetHr) % 24).toString();
      }
      min = ((utcMin - offsetMin) % 60).toString();
    }
    return `${hr.length===1 ? "0"+hr: hr.toString()}:${min.length===1 ? "0"+min: min}`;
  };