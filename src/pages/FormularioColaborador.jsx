import { useState, useEffect } from "react"
import useProyectos from "../hooks/UseProyectos"
import Alerta from "../components/Alerta"



const FormularioColaborador = () => {

 

  const [email, setEmail] = useState('')

  const {mostrarAlerta, alerta, submitColaborador} = useProyectos()

  const handleSubmit = e => {
    e.preventDefault()

    if(email === ''){
      mostrarAlerta({
        msg: 'El Email es Obligatorio',
        error:true
       })
       return
    }
    submitColaborador(email)
  }

  const {msg} = alerta

  return (
    <form
      onSubmit={handleSubmit}
      className=" bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
    >

      {msg && <Alerta alerta={alerta}/>}
       <div className='mb-5'>
        <label 
            className='text-gray-700 uppercase font-bold text-sm'
            htmlFor='email'
          >
            Email Colaborador
          </label>

          <input
            type='email'
            id='email'
            placeholder='Email del Usuario'
            className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md '
            value={email}
            onChange={ e => setEmail(e.target.value)}
                                              />
       </div>

       <input 
          type='submit'
          className='bg-sky-600 hover:bg-sky-700 w-full uppercase text-sm text-white font-bold p-3 cursor-pointer transition-colors rounded'
          value='Buscar Colaborador'
        />
    </form>
  )
}

export default FormularioColaborador