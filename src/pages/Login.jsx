import {useState} from 'react'
import { Link, useNavigate } from "react-router-dom"
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/UseAuth'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const {setAuth} = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async e =>{
    e.preventDefault()

    if([email, password].includes('')){
      setAlerta({
        msg:'Todos los campos son Obligatorios',
        error: true
      })
      return
    }
    try {
       const {data} =  await clienteAxios.post('/usuarios/login', {email, password})
      setAlerta({})
       localStorage.setItem('token', data.token)
       setAuth(data)
       navigate('/proyectos')

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })

    }
  }

  const {msg} = alerta


  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesión y administra tus  {" "}
        <span className="text-slate-700">proyectos</span> 
      </h1>

        {msg && <Alerta alerta={alerta}/>}

        <form 
          onSubmit={handleSubmit}
          action="" 
          className="my-10 bg-white shadow rounded-lg p-10"
        >
            <div className="my-5">
              <label 
                className="uppercaset text-gray-600 block text-xl font-bold" 
                htmlFor="email"
                
              >Email:</label>
              <input 
                type="text" 
                placeholder="Email del registro"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                name="" 
                id="email" 
                value={email}
                onChange={ e => setEmail(e.target.value)}
              />
            </div>

            <div className="my-5">
              <label 
                className="uppercaset text-gray-600 block text-xl font-bold" 
                htmlFor="password"
                
              >Password:</label>
              <input 
                type="password" 
                placeholder="Password de registro"
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                name="" 
                id="password" 
                value={password}
                onChange={ e => setPassword(e.target.value)}
              />
            </div>

            <input 
              type="submit" 
              value="Iniciar Sesión"
              className="bg-sky-700 w-full py-3 mb-5 rounded-md text-white font-bold uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
            />
        </form>

        <nav className="lg:flex lg:justify-between">
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/registrar"
          >
            ¿No tienes una cuenta? Regístrate
          </Link>
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/olvide-password"
          >
            Olvide Mi Password
          </Link>

        </nav>
    </>
  )
}

export default Login