import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import {useNavigate} from 'react-router-dom'
import io from 'socket.io-client'
import useAuth from "../hooks/UseAuth";

let socket


const ProyectosContext = createContext()


const ProyectosProvider = ({children}) => {

  const [ proyectos, setProyectos] = useState([])
  const [alerta, setAlerta] = useState({})
  const [proyecto, setProyecto] = useState({})
  const [cargando , setCargando] = useState(false)
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
  const [tarea, setTarea] = useState({})
  const [ colaborador, setColaborador] = useState('')
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
  const [buscador, setBuscador] = useState(false)

  const navigate = useNavigate()
  const { auth } = useAuth()

  useEffect( () => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          }
      }
      const {data } = await clienteAxios('/proyectos', config)
      setProyectos(data)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProyectos()
  },[auth])

  useEffect( ()=>{
    socket = io(import.meta.env.VITE_BACKEND_URL)

  },[])

  const mostrarAlerta = alerta =>{
    setAlerta(alerta)

    setTimeout(() => {
      setAlerta({})
    }, 5000);
  }

  const submitProyecto = async proyecto => {

    if (proyecto.id){
       await editarProyecto(proyecto)
    }else{
     await nuevoProyecto(proyecto)
    }
    return
    
  }

  const editarProyecto = async proyecto => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          }
      }

      const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`,proyecto, config)
      //sincronizar state
      const proyectosActualizados= proyectos.map(proyectoState => proyectoState._id ===data._id ? data : proyectoState )
      setProyectos(proyectosActualizados)
      setAlerta({
        msg: "Proyecto Actualizado correctamente",
        error:false
      })
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
        
      }, 1500);
    } catch (error) {
      console.log(error)
    }
  }

  const nuevoProyecto = async proyecto =>{
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          }
      }

      const {data} = await clienteAxios.post('/proyectos', proyecto, config)
      setProyectos([...proyectos, data])
      setAlerta({
        msg: "El proyecto se creo correctamente",
        error:false
      })
      setTimeout(() => {
        setAlerta({})
        // navigate('/proyectos')
        
      }, 1500);
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerProyecto = async id =>{
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          }
      }

      const {data} = await clienteAxios(`/proyectos/${id}`, config)
      setProyecto(data)
      setAlerta({})
    } catch (error) {
      navigate('/proyectos')
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 300);
    }
    setCargando(false)
  }

  const eliminarProyecto = async id => {
      try {
        const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          }
      }

      const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)

      //sincronizar state
      const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)

      setProyectos(proyectosActualizados)

      setAlerta({
        msg: data.msg,
        error:false
      })
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
        
      }, 1500);
      } catch (error) {
        console.log(error)
      }
  }

  const handleModalTarea = () =>{
    setModalFormularioTarea(!modalFormularioTarea)
    setTarea({})
  }

  const submitTarea = async tarea =>{

    if(tarea?.id){
      await editarTarea(tarea)
    }else{
      await crearTarea(tarea)
    }
  }
    const crearTarea =  async tarea =>{
      try {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         }
      }

      const{data } = await clienteAxios.post('/tareas', tarea, config)
      //Agrega tarea state

      
      setAlerta({})
      setModalFormularioTarea(false)

      //SOCKET IO
      socket.emit('nueva tarea', data)
    } catch (error) {
      console.log(error)
    }
    }

   const editarTarea = async tarea =>{
     try {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         }
      }

      const {data} = await clienteAxios.put(`/tareas/${tarea.id}`,tarea, config)

      //socket io
     socket.emit('actualizar tarea', data)
     
      setAlerta({})
      setModalFormularioTarea(false)
     } catch (error) {
        console.log(error)
     }
   }
  

  const handleModalEditar = tarea =>{
    setTarea(tarea)
    setModalFormularioTarea(true)
  }

  const handleModalEliminarTarea = tarea => {
    setTarea(tarea)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const eliminarTarea = async () =>{
    try {
      const token = localStorage.getItem('token')
        if(!token) return

        const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         }
      }

      const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
      setAlerta({
        msg: data.msg,
        error: false
      })

      setModalEliminarTarea(false)
      // SOCKET IO
      socket.emit('eliminar tarea', tarea)
      
      
      setTimeout(() => {
        setAlerta({})
      }, 1500);

      setTarea({})

    } catch (error) {
      console.log(error)
    }

    
  }

  const submitColaborador = async email => {
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
        if(!token) return

        const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         }
      }

      const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)

      setColaborador(data)
      setAlerta({})
    } catch (error) {
      
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
    setCargando(false)
  }

  const agregarColaborador = async email =>{

   
    try {
      const token = localStorage.getItem('token')
        if(!token) return

        const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         }
      }
      const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
  
        setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const handleModalEliminarColaborador = (colaborador) =>{
    setColaborador(colaborador)
    setModalEliminarColaborador(!modalEliminarColaborador)
  }

  const eliminarColaborador = async () =>{
    try {
      const token = localStorage.getItem('token')
        if(!token) return

        const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         }
      }
      const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

      const protectoActualizado = {...proyecto}
      protectoActualizado.colaboradores = protectoActualizado.colaboradores.filter(colaboradorState => 
        colaboradorState._id !== colaborador._id)

      setProyecto(protectoActualizado)
    
        setAlerta({
        msg: data.msg,
        error: false
      })
     
      setTimeout(() => {
        setAlerta({})
      }, 3000);
      
      setColaborador({})
      setModalEliminarColaborador(false)
      
    } catch (error) {
      console.log(error.response)
    }
  }
    const completarTarea = async id => {
      try {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         }
      }
      const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

      // socket io
      socket.emit('cambiar estado', data)
    
        setTarea({})
        setAlerta({})
      } catch (error) {
        console.log(error.response)
      }
    }

    const handleBuscador = () => {
      setBuscador(!buscador)
    }

    //socket io

    const submitTareaProyecto = (tarea) =>{
      //agregar tarea al state
      const proyectoActualizado = {...proyecto}
      proyectoActualizado.tareas= [...proyectoActualizado.tareas, tarea]
      setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea =>{
      const proyectoActualizado = {...proyecto}
      proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => 
        tareaState._id !== tarea._id)

      setProyecto(proyectoActualizado)
    }

    const actualizarTarea = tarea =>{
      const proyectoActualizado = {...proyecto}
      proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState =>  tareaState._id === tarea._id ? tarea : tareaState)
      setProyecto(proyectoActualizado)
    }
     const cambiarEstado = tarea =>{
      const proyectoActualizado = {...proyecto}
      proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState =>
        tareaState._id === tarea._id ? tarea: tareaState)
        setProyecto(proyectoActualizado)
     }

     const cerrarSesionProyectos = ()=>{
      setProyectos([])
      setProyecto({})
      setAlerta({})
     }


  return(
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto, 
        cargando, 
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditar,
        tarea,
        handleModalEliminarTarea,
        modalEliminarTarea,
        eliminarTarea,
        submitColaborador, 
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareaProyecto,
        eliminarTareaProyecto,
        actualizarTarea, 
        cambiarEstado,
        cerrarSesionProyectos
        

      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}

export {
  ProyectosProvider
} 

export default ProyectosContext