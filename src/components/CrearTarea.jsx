import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/UseProyectos"
import useAdmin from "../hooks/useAdmin"
const CrearTarea = ({tarea}) => {

  const admin = useAdmin()

  const {handleModalEditar, handleModalEliminarTarea, completarTarea} = useProyectos()

  const {nombre, descripcion, fechaEntrega, prioridad, _id, estado} = tarea

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start ">
        <p className=" text-xl mb-2">{nombre}</p>
        <p className=" text-sm mb-2 uppercase text-gray-500">{descripcion}</p>
        <p className=" text  mb-2">{formatearFecha(fechaEntrega)}</p>
        <p className=" text-xl text-gray-600">Prioridad: {prioridad}</p>
        {estado && <p className="text-xs bg-green-600 uppercase p-1 text-white rounded-lg">Completada por : {tarea.completado.nombre}</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {admin && (

          <button
            className="bg-indigo-600 px-4 py-3  text-sm text-white uppercase font-bold rounded-lg"
            onClick={ ()=> handleModalEditar(tarea)}
          >
            Editar
          </button>
        )}

              <button
                  className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-sm text-white uppercase font-bold rounded-lg`}
                  onClick={ () => completarTarea(_id)}
                >{estado ? 'Completa' : 'Incompleta'}</button>

        {admin &&(

          <button
            className="bg-red-600 px-4 py-3 text-sm text-white uppercase font-bold rounded-lg"
            onClick={() => handleModalEliminarTarea(tarea)}
          >
          Eliminar
          </button>

        )}
      </div>
      
    </div>
  )
}

export default CrearTarea
