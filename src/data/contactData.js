// src/data/contactData.js
export const contactData = {
  header: {
    subtitle: "Dê o Primeiro Passo",
    titlePart1: "Conte-nos sobre a",
    titlePart2: "sua visão."
  },
  form: {
    name: {
      label: "Nome",
    },
    email: {
      label: "E-mail",
    },
    type: {
      label: "Qual tipo de trabalho você procura?",
      placeholder: "Selecione uma opção",
      options: [
        { value: "editorial", label: "Editorial artístico" },
        { value: "direcao", label: "Direção Criativa & Brand" },
        { value: "casal", label: "Ensaio de Casal & Família" },
        { value: "outro", label: "Outro" }
      ]
    },
    whatsapp: {
      label: "Posso te chamar no Whats App?",
      placeholder: "(DDD) Seu número"
    },
    message: {
      label: "Me conta aqui o que você precisa..."
    },
    submitBtn: "Enviar Mensagem"
  }
};