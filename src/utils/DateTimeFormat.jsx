export const formatDateArray = (arr) => {
    if (!Array.isArray(arr) || arr.length < 6) return 'Không rõ';
    try {
      // arr = [year, month, day, hour, minute, second, nano]
      const [year, month, day, hour, minute, second, nano] = arr;
      const millis = Math.floor(nano / 1_000_000); // convert nano to millis
      const dateObj = new Date(year, month - 1, day, hour, minute, second, millis);
  
      if (isNaN(dateObj.getTime())) return 'Không rõ';
  
      return dateObj.toLocaleString('vi-VN');
    } catch {
      return 'Không rõ';
    }
  };
  