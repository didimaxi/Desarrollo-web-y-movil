// Servicios dummy: GET sobre un JSON local y POST simulado con latencia.
// Para probar errores abre la página con ?fallo=catalogo o ?fallo=pedido (falla una vez por sesión).
const API = {
  espera: ms => new Promise(r => setTimeout(r, ms)),

  fallaUnaVez(clave) {
    const pedido = new URLSearchParams(location.search).get('fallo');
    if (pedido !== clave || sessionStorage.getItem('fallo_' + clave)) return false;
    sessionStorage.setItem('fallo_' + clave, '1');
    return true;
  },

  async getProductos() {
    await this.espera(700);
    if (this.fallaUnaVez('catalogo')) throw new Error('No pudimos cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.');
    const res = await fetch('data/productos.json');
    if (!res.ok) throw new Error('El servicio de catálogo respondió con error ' + res.status + '.');
    return res.json();
  },

  async crearPedido(pedido) {
    await this.espera(1300);
    if (this.fallaUnaVez('pedido')) throw new Error('El servicio de pedidos no respondió');
    return { ok: true, id: 'DT-' + Date.now().toString().slice(-6), ...pedido };
  }
};
