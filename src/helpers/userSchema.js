import * as yup from 'yup'

const userSchema = yup
  .object()
  .shape({
    name: yup.string().required('Nome é obrgatório'),
    email: yup
      .string()
      .email('Insira um email válido')
      .required('Email é obrigatório'),
    password: yup
      .string()
      .required('Senha é obrgatório')
      .min(8, 'A senha deve conter no mínimo 8 caracteres'),
    rua: yup.string().required(),
    numero: yup.number().required(),
    bairro: yup.string().required(),
    cidade: yup.string().required(),
    uf: yup.string(2).required()
  })
  .noUnknown()

export default userSchema
