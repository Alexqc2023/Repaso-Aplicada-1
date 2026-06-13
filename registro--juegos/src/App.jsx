import { useState, useEffect } from 'react';
import { supabase } from './supabase/supabaseClient'; 

function App() {
  const [titulo, setTitulo] = useState('');
  const [consola, setConsola] = useState('');
  const [precio, setPrecio] = useState('');
  const [listaJuegos, setListaJuegos] = useState([]);
  
  // 1. NUEVA CAJITA: ¿Estamos editando o creando?
  const [editando, setEditando] = useState(false);

  const obtenerJuegos = async () => {
    const { data } = await supabase.from('Juegos').select('*');
    if (data) setListaJuegos(data);
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

  const guardarJuego = async () => {
    if (titulo === '' || consola === '' || precio === '') {
      alert("Debes llenar todos los campos");
      return; 
    }

    if (editando) {
      // 2. MODO ACTUALIZAR: Usamos .update()
      const { error } = await supabase
        .from('Juegos')
        .update({ Consola: consola, Precio: parseInt(precio) })
        .eq('Titulo', titulo); // Le decimos cuál juego actualizar
        
      if (error) alert("Error al editar: " + error.message);
      else alert("¡Juego actualizado!");
    } else {
      // 3. MODO CREAR: Usamos .insert() (Como ya lo teníamos)
      const { error } = await supabase
        .from('Juegos')
        .insert([{ Titulo: titulo, Consola: consola, Precio: parseInt(precio) }]);
        
      if (error) alert("Error al guardar: " + error.message);
      else alert("¡Juego guardado con éxito!");
    }

    // Limpiamos todo al terminar
    setTitulo(''); setConsola(''); setPrecio('');
    setEditando(false);
    obtenerJuegos();
  };

  const eliminarJuego = async (tituloDelJuego) => {
    const { error } = await supabase.from('Juegos').delete().eq('Titulo', tituloDelJuego);
    if (!error) obtenerJuegos();
  };

  // 4. FUNCIÓN PARA EL BOTÓN AMARILLO: Sube los datos a las cajas de texto
  const cargarDatos = (juego) => {
    setTitulo(juego.Titulo);
    setConsola(juego.Consola);
    setPrecio(juego.Precio);
    setEditando(true); // Encendemos el modo edición
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Mi Colección de Juegos</h1>
      
      <div className="card p-4 mt-4 shadow-sm">
        <h3 className="mb-3">{editando ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h3>
        
        {/* disabled={editando} bloquea la caja del título para que no le cambies el nombre a la llave primaria */}
        <input type="text" className="form-control mb-2" placeholder="Nombre del juego" value={titulo} onChange={(e) => setTitulo(e.target.value)} disabled={editando} />
        <input type="text" className="form-control mb-2" placeholder="Consola" value={consola} onChange={(e) => setConsola(e.target.value)} />
        <input type="number" className="form-control mb-3" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        
        <button onClick={guardarJuego} className={editando ? "btn btn-warning w-100" : "btn btn-primary w-100"}>
          {editando ? 'Guardar Cambios' : 'Guardar Juego'}
        </button>

        {/* Botón extra por si te arrepientes de editar */}
        {editando && (
           <button onClick={() => { setEditando(false); setTitulo(''); setConsola(''); setPrecio(''); }} className="btn btn-secondary w-100 mt-2">
             Cancelar
           </button>
        )}
      </div>

      <div className="mt-5">
        <h3>Lista de Juegos</h3>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Título</th>
              <th>Consola</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaJuegos.map((juego) => (
              <tr key={juego.Titulo}>
                <td>{juego.Titulo}</td>
                <td>{juego.Consola}</td>
                <td>${juego.Precio}</td>
                <td>
                  {/* NUEVO BOTÓN AMARILLO */}
                  <button onClick={() => cargarDatos(juego)} className="btn btn-warning btn-sm me-2">
                    Editar
                  </button>
                  <button onClick={() => eliminarJuego(juego.Titulo)} className="btn btn-danger btn-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;