async function getPublicIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error al obtener la IP pública:', error);
      return null;
    }
  }
  
  
  module.exports = getPublicIPAddress;