
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/UseProyectos"
import useAdmin from "../hooks/useAdmin"
import { Link } from "react-router-dom"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador"
import CrearTarea from "../components/CrearTarea"

import Colaborador from "../components/Colaborador"
import io from 'socket.io-client'

let socket

const Proyecto = () => {

  const {obtenerProyecto, proyecto,cargando, handleModalTarea,submitTareaProyecto,
    eliminarTareaProyecto, actualizarTarea, cambiarEstado } = useProyectos()
  const params = useParams()  

  const admin =  useAdmin()


  useEffect(() => {
    
    obtenerProyecto(params.id)
    
  }, [])

  useEffect( ()=>{
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('abrir proyecto', params.id)
  },[])

  useEffect( ( ) =>{
    socket.on('tarea agregada', tareaNueva=>{
      if(tareaNueva.proyecto ===proyecto._id){
        submitTareaProyecto(tareaNueva)}
    }) 

    socket.on('tarea eliminada', tareaEliminada =>{
      if(tareaEliminada.proyecto === proyecto._id){
        eliminarTareaProyecto(tareaEliminada)
      }
    })
    socket.on('tarea actualizada', tareaActualizada =>{
      if(tareaActualizada.proyecto._id === proyecto._id){
        actualizarTarea(tareaActualizada)
      }
    })

    socket.on('estado cambiado', estadoCambiado => {
      if(estadoCambiado.proyecto._id === proyecto._id){
        cambiarEstado(estadoCambiado)
      }
    })
  })

  const {nombre} = proyecto
  

 

  if(cargando) return 'Cargando...'

  

  return ( 

    <>
      <div className="flex justify-between">
        <h1 className="text-2xl md:text-4xl  font-black ">{nombre}</h1>
        {admin && (

          <div className="flex items-center gap-2 text-gray-400 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>

              <Link 
                to={`/proyectos/editar/${params.id}`}
                className="uppercase font-bold"
              >
                Editar
              </Link>
          </div>

        )}
      </div >

      {admin && (

          <button
          onClick={ handleModalTarea}
            className=" flex item-center justify-center gap-2 tesx-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white mt-5 text-center"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            Nueva Tarea
          </button>

      )}   

        <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

        


      

        <div className=" bg-white shadow mt-10 rounded-lg">
          {proyecto.tareas?.length ? 
          proyecto.tareas?.map( tarea =>(
            <CrearTarea
              key={tarea._id}
              tarea={tarea}
            />
          )) : 
          <p className=" text-center p-10 my-5">No hay tareas en este proyecto</p> }
        </div>

        {admin && (
          <>
            <div className='flex items-center justify-between mt-10'>

              <p className ="font-bold text-xl ">Colaboradores</p>

              

                <Link
                  to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                  className="text-gray-400 uppercase font-bold hover:text-black flex gap-2"
                >

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                Añadir
                </Link>
              
            </div>

            <div className=" bg-white shadow mt-10 rounded-lg">
              {proyecto.colaboradores?.length ? 
              proyecto.colaboradores?.map( colaborador =>(
                <Colaborador
                  key={colaborador._id}
                  colaborador={colaborador}
                />
              )) : 
              <p className=" text-center p-10 my-5">No hay colaboradores en este proyecto</p> }
            </div>
        </>
        )}
        <ModalFormularioTarea/>
        <ModalEliminarTarea/>
        <ModalEliminarColaborador/>
    </>
    )
    
  
}

export default Proyecto