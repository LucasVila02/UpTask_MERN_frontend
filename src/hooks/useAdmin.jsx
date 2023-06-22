import useProyectos from "./UseProyectos";
import useAuth from "./UseAuth";

const useAdmin = () =>{
  const  {proyecto} =  useProyectos()
  const {auth} = useAuth()

  return proyecto.creador === auth._id
}
export default useAdmin