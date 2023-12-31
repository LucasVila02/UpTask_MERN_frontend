import { Link } from "react-router-dom"
import useAuth from "../hooks/UseAuth"


const PreviewProyecto = ({proyecto}) => {

  const {auth} = useAuth()

  const {nombre, _id, cliente, creador} = proyecto

  return (
    <div className="border-b p-5 flex flex-col md:flex-row  justify-between ">
      
      <div className="flex items-center gap-2">
        <p className="flex-1">
          {nombre}
          <span className="text-sm text-gray-500 uppercase ">
            {' '}{cliente}
          </span>
        </p>

        {auth._id !== creador && (
            <p className="p-1 text-xs rounded-lg bg-green-500 font-bold text-white uppercase">Colaborador </p> 
          
          )}
      </div>
      

      <Link
        className="text-gray-500 hover:text-gray-800 uppercase text-sm font-bold "
        to={`${_id}`}
      >Ver Proyecto</Link>

    </div>
  )
}

export default PreviewProyecto