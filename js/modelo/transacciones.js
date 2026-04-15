'use strict';

const transacciones = [];

let siguienteId = 1;

export function registrarTransaccion(tipo, descripcion, monto) {
  transacciones.push({
    id: siguienteId++,
    tipo,
    descripcion: descripcion.trim(),
    monto,
  });
}

export function obtenerTransacciones() {
  return transacciones;
}

export function obtenerTotales() {
  let ingresos = 0;
  let egresos = 0;
  for (let i = 0; i < transacciones.length; i++) {
    const t = transacciones[i];
    if (t.tipo === 'ingreso') ingresos += t.monto;
    else egresos += t.monto;
  }
  return { ingresos, egresos };
}

export function porcentajeGastosSobreIngresos(totalIngresos, totalEgresos) {
  if (totalIngresos <= 0) return 0;
  return (totalEgresos * 100) / totalIngresos;
}
