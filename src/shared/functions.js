export const getCurrentTime = (utcTime, timeZoneStr) => {
    const utcTimeExact = utcTime.slice(11, 16);
    const  timeZoneStrExact = timeZoneStr.slice(3);
    const offsetSign = timeZoneStrExact.slice(0, 1);
    const offsetHr = parseInt(timeZoneStrExact.slice(1, 3));
    const offsetMin = parseInt(timeZoneStrExact.slice(-2));
  
    const utcHr = parseInt(utcTimeExact.split(/:/)[0]);
    const utcMin = parseInt(utcTimeExact.split(/:/)[1]);
  
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

  export const randomColor = (() => {
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();
  
    var hslToRgb = function (h, s, l){
        var r, g, b;
  
        if(s === 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
  
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
  
        return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
    };
    
    return function(){
      h += golden_ratio_conjugate;
      h %= 1;
      return hslToRgb(h, 0.5, 0.60);
    };
  })();