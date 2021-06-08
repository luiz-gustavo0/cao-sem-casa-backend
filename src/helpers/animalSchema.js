import * as yup from 'yup'

const animalSchema = yup
  .object()
  .shape({
    name: yup.string().required('Este campo é obrigatório'),
    peso: yup.number().positive().required('Este campo é obrigatório'),
    idade: yup.number().positive().required('Este campo é obrigatório'),
    raca: yup.string().required('Este campo é obrigatório'),
    tipo: yup.string().required('Este campo é obrigatório'),
    vacinado: yup.string().required('Este campo é obrigatório'),
    vermifugado: yup.string().required('Este campo é obrigatório'),
    castrado: yup.string().required('Este campo é obrigatório'),
    sexo: yup.string(1).required('Este campo é obrigatório')
  })
  .noUnknown()

export default animalSchema
