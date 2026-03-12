# Clínica Inteligente

Sistema web desenvolvido para gerenciamento de consultas médicas, com autenticação de usuários, agendamento de consultas, integração com CEP e previsão do tempo, além de painel administrativo para acompanhamento dos dados do sistema.

> **Projeto desenvolvido para trabalho de faculdade**, com o objetivo de aplicar conceitos de desenvolvimento full stack, autenticação, integração com APIs externas, persistência de dados e deploy de aplicações web.

---

## 📚 Contexto acadêmico

Este projeto foi desenvolvido como parte de um **trabalho universitário**, com foco na prática de conteúdos relacionados a:

- Desenvolvimento web full stack
- Criação e consumo de APIs
- Autenticação e controle de acesso
- Banco de dados NoSQL
- Integração com serviços externos
- Estruturação de interfaces responsivas
- Publicação de aplicações em nuvem

---

## 🎯 Objetivo do projeto

O sistema tem como objetivo simular uma plataforma de atendimento inteligente para clínicas médicas, permitindo que pacientes e equipe administrativa gerenciem agendamentos de forma simples e organizada.

---

## ✨ Funcionalidades

### Usuários
- Cadastro de usuários
- Login com autenticação
- Controle de acesso por perfil
- Logout

### Agendamentos
- Criação de consultas
- Visualização de agendamentos
- Exclusão de agendamentos
- Listagem personalizada por usuário
- Painel administrativo com acesso a todos os agendamentos

### Integrações externas
- Consulta de endereço a partir do **CEP**
- Exibição de **alerta de chuva / previsão climática**

### Painel administrativo
- Visualização de usuários cadastrados
- Visualização de próximos agendamentos
- Visualização de todos os agendamentos do sistema

---

## 👤 Perfis de acesso

O sistema trabalha com diferentes perfis de usuário:

- **Paciente**: pode acessar e gerenciar seus próprios agendamentos
- **Secretário(a)**: pode visualizar dados administrativos
- **Administrador**: possui acesso ao painel administrativo completo

> No fluxo atual do frontend, a opção de cadastro como **Administrador** foi removida da tela de registro, sendo esse perfil reservado para criação prévia no sistema.

---

## 🛠️ Tecnologias utilizadas

### Frontend
- Vue.js 3
- Vue Router
- Vite
- Axios
- CSS

### Backend
- Node.js
- Express
- JWT
- bcryptjs
- Mongoose

### Banco de dados
- MongoDB Atlas

### APIs externas
- ViaCEP
- OpenWeather

### Deploy
- Frontend publicado em ambiente de hospedagem web
- Backend publicado no Render
- Banco hospedado no MongoDB Atlas
