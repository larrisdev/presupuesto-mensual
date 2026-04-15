'use strict';

import * as Modelo from '../modelo/transacciones.js';
import { actualizarVista } from './resumen.js';

function parsearMonto(valor) {
  if (valor === null || valor === undefined) return NaN;
  const s = String(valor).trim().replace(',', '.');
  if (s === '') return NaN;
  return Number.parseFloat(s);
}

function ocultarError() {
  const el = document.getElementById('formularioError');
  el.hidden = true;
  el.textContent = '';
}

function mostrarError(mensaje) {
  const el = document.getElementById('formularioError');
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

function limpiarCampos() {
  document.getElementById('descripcion').value = '';
  document.getElementById('monto').value = '';
}

function alAgregar() {
  ocultarError();

  const tipo = document.getElementById('tipo').value;
  const descripcion = document.getElementById('descripcion').value;
  const montoNum = parsearMonto(document.getElementById('monto').value);

  const v = validarTransaccion(tipo, descripcion, montoNum);
  if (!v.ok) {
    mostrarError(v.mensaje);
    return;
  }

  Modelo.registrarTransaccion(tipo, descripcion, montoNum);
  actualizarVista();
  limpiarCampos();
}

export function inicializar() {
  document.getElementById('btnAgregar').addEventListener('click', alAgregar);
}
