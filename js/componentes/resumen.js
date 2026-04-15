'use strict';

import * as Modelo from '../modelo/transacciones.js';

const MESES_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

function formatearDisponible(valor) {
  const signo = valor >= 0 ? '+' : '-';
  const abs = Math.abs(valor);
  return `${signo} ${abs.toFixed(2)}`;
}

function establecerMesActual() {
  const ahora = new Date();
  const mes = MESES_ES[ahora.getMonth()];
  const anio = ahora.getFullYear();
  document.getElementById('mesActual').textContent = `Presupuesto de ${mes} ${anio}`;
}

export function actualizarVista() {
  const { ingresos, egresos } = Modelo.obtenerTotales();
  const disponible = ingresos - egresos;
  const pct = Modelo.porcentajeGastosSobreIngresos(ingresos, egresos);

  document.getElementById('presupuestoTotal').textContent = formatearDisponible(disponible);
  document.getElementById('totalIngresos').textContent = `+ ${ingresos.toFixed(2)}`;
  document.getElementById('totalEgresos').textContent = `- ${egresos.toFixed(2)}`;
  document.getElementById('porcentajeGastos').textContent = `${pct.toFixed(2)}%`;
}

export function inicializar() {
  establecerMesActual();
  actualizarVista();
}
