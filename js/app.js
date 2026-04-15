'use strict';

const MESES_ES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre'
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
  const s = String(valor).trim().replace(',', '.');
  return Number.parseFloat(s);
}

function validarTransaccion(tipo, descripcion, monto) {
  if (!descripcion.trim()) {
    return { ok: false, mensaje: 'La descripción no puede estar vacía.' };
  }
  if (Number.isNaN(monto)) {
    return { ok: false, mensaje: 'El monto debe ser un número válido.' };
  }
  if (monto <= 0) {
    return { ok: false, mensaje: 'El monto debe ser mayor que cero.' };
  }
  return { ok: true };
}

function mostrarError(msg) {
  const el = $('formularioError');
  el.textContent = msg;
  el.hidden = false;
}

function ocultarError() {
  const el = $('formularioError');
  el.hidden = true;
}

function totales() {
  let ingresos = 0;
  let egresos = 0;

  transacciones.forEach(t => {
    if (t.tipo === 'ingreso') ingresos += t.monto;
    else egresos += t.monto;
  });

  return { ingresos, egresos };
}

function porcentajeGastos(ingresos, egresos) {
  if (ingresos === 0) return 0;
  return (egresos * 100) / ingresos;
}

function formatear(valor) {
  const signo = valor >= 0 ? '+' : '-';
  return `${signo} ${Math.abs(valor).toFixed(2)}`;
}

function actualizarResumen() {
  const { ingresos, egresos } = totales();
  const disponible = ingresos - egresos;
  const pct = porcentajeGastos(ingresos, egresos);

  $('presupuestoTotal').textContent = formatear(disponible);
  $('totalIngresos').textContent = `+ ${ingresos.toFixed(2)}`;
  $('totalEgresos').textContent = `- ${egresos.toFixed(2)}`;
  $('porcentajeGastos').textContent = `${pct.toFixed(2)}%`;
}

function registrarTransaccion(tipo, descripcion, monto) {
  transacciones.push({
    id: siguienteId++,
    tipo,
    descripcion,
    monto
  });
}

function renderizarTransacciones(tipoActivo = 'ingreso') {
  const contenedor = $('listaTransacciones');
  contenedor.innerHTML = '';

  const { ingresos } = totales();

  const lista = transacciones.filter(t => t.tipo === tipoActivo);

  lista.forEach(t => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.padding = '6px 0';

    let html = `
      <span>${t.descripcion}</span>
      <span>${t.tipo === 'ingreso' ? '+' : '-'} ${t.monto.toFixed(2)}</span>
    `;

    if (t.tipo === 'egreso' && ingresos > 0) {
      const pct = (t.monto * 100) / ingresos;

      html = `
        <span>${t.descripcion}</span>
        <span>
          - ${t.monto.toFixed(2)}
          <span style="background:#166534;color:white;padding:2px 6px;border-radius:4px;font-size:12px;">
            ${pct.toFixed(2)}%
          </span>
        </span>
      `;
    }

    div.innerHTML = html;
    contenedor.appendChild(div);
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
  const monto = parsearMonto($('monto').value);

  const v = validarTransaccion(tipo, descripcion, monto);

  if (!v.ok) {
    mostrarError(v.mensaje);
    return;
  }

  registrarTransaccion(tipo, descripcion, monto);

  actualizarResumen();
  renderizarTransacciones(tipo);
  limpiarFormulario();
}


function configurarTabs() {
  $('tabIngresos').addEventListener('click', () => {
    $('tabIngresos').classList.add('activo');
    $('tabEgresos').classList.remove('activo');
    renderizarTransacciones('ingreso');
  });

  $('tabEgresos').addEventListener('click', () => {
    $('tabEgresos').classList.add('activo');
    $('tabIngresos').classList.remove('activo');
    renderizarTransacciones('egreso');
  });
}


function init() {
  establecerMesActual();
  actualizarResumen();
  configurarTabs();

  $('btnAgregar').addEventListener('click', alAgregar);

  renderizarTransacciones();
}

document.addEventListener('DOMContentLoaded', init);