'use strict';

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

const transacciones = [];

let siguienteId = 1;

function $(id) {
  return document.getElementById(id);
}

function establecerMesActual() {
  const ahora = new Date();
  const mes = MESES_ES[ahora.getMonth()];
  const anio = ahora.getFullYear();
  $('mesActual').textContent = `Presupuesto de ${mes} ${anio}`;
}

function parsearMonto(valor) {
  if (valor === null || valor === undefined) return NaN;
  const s = String(valor).trim().replace(',', '.');
  if (s === '') return NaN;
  return Number.parseFloat(s);
}

function ocultarError() {
  const el = $('formularioError');
  el.hidden = true;
  el.textContent = '';
}

function mostrarError(mensaje) {
  const el = $('formularioError');
  el.textContent = mensaje;
  el.hidden = false;
}

function validarTransaccion(tipo, descripcion, montoNum) {
  const desc = descripcion.trim();
  if (!desc) {
    return { ok: false, mensaje: 'La descripción no puede estar vacía.' };
  }
  if (Number.isNaN(montoNum)) {
    return { ok: false, mensaje: 'El monto debe ser un número válido.' };
  }
  if (montoNum <= 0) {
    return { ok: false, mensaje: 'El monto debe ser mayor que cero.' };
  }
  if (tipo !== 'ingreso' && tipo !== 'egreso') {
    return { ok: false, mensaje: 'Seleccione un tipo de transacción válido.' };
  }
  return { ok: true, mensaje: '' };
}

function totales() {
  let ingresos = 0;
  let egresos = 0;
  for (let i = 0; i < transacciones.length; i++) {
    const t = transacciones[i];
    if (t.tipo === 'ingreso') ingresos += t.monto;
    else egresos += t.monto;
  }
  return { ingresos, egresos };
}

function porcentajeGastosSobreIngresos(totalIngresos, totalEgresos) {
  if (totalIngresos <= 0) return 0;
  return (totalEgresos * 100) / totalIngresos;
}

function formatearDisponible(valor) {
  const signo = valor >= 0 ? '+' : '-';
  const abs = Math.abs(valor);
  return `${signo} ${abs.toFixed(2)}`;
}

function actualizarResumen() {
  const { ingresos, egresos } = totales();
  const disponible = ingresos - egresos;
  const pct = porcentajeGastosSobreIngresos(ingresos, egresos);

  $('presupuestoTotal').textContent = formatearDisponible(disponible);
  $('totalIngresos').textContent = `+ ${ingresos.toFixed(2)}`;
  $('totalEgresos').textContent = `- ${egresos.toFixed(2)}`;
  $('porcentajeGastos').textContent = `${pct.toFixed(2)}%`;
}

function registrarTransaccion(tipo, descripcion, monto) {
  transacciones.push({
    id: siguienteId++,
    tipo,
    descripcion: descripcion.trim(),
    monto,
  });
}

function limpiarFormulario() {
  $('descripcion').value = '';
  $('monto').value = '';
}

function alAgregar() {
  ocultarError();

  const tipo = $('tipo').value;
  const descripcion = $('descripcion').value;
  const montoNum = parsearMonto($('monto').value);

  const v = validarTransaccion(tipo, descripcion, montoNum);
  if (!v.ok) {
    mostrarError(v.mensaje);
    return;
  }

  registrarTransaccion(tipo, descripcion, montoNum);
  actualizarResumen();
  limpiarFormulario();
}

function init() {
  establecerMesActual();
  actualizarResumen();
  $('btnAgregar').addEventListener('click', alAgregar);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
