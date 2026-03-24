const categoriasBase = ["Todas", "Trabajo", "Estudios", "Personal"];

let categoriasUsuario = [];

function obtenerTodas() {
  return [...categoriasBase, ...categoriasUsuario];
}


function crearCategoria(nombre) {
  if (categoriasBase.includes(nombre) || categoriasUsuario.includes(nombre)) {
    throw new Error('ALREADY_EXISTS');
  }

  categoriasUsuario.push(nombre);
  return { nombre }
}

function eliminarCategoria(nombre) {
  if (categoriasBase.includes(nombre)) {
    throw new Error('BASE_CATEGORY');
  }

  const index = categoriasUsuario.indexOf(nombre);

  if (index === -1) {
    throw new Error('NOT_FOUND');
  }

  categoriasUsuario.splice(index, 1);
}

module.exports = {
  obtenerTodas,
  crearCategoria,
  eliminarCategoria
};