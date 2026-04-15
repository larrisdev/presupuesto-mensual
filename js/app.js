'use strict';

import { inicializar as inicializarResumen } from './componentes/resumen.js';
import { inicializar as inicializarFormulario } from './componentes/formulario.js';
import { inicializar as inicializarListado } from './componentes/listado.js';

function arrancar() {
  inicializarResumen();
  inicializarFormulario();
  inicializarListado();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancar);
} else {
  arrancar();
}
