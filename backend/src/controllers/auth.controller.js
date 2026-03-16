const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '8h'
    }
  );
}

async function register(req, res) {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      message: 'Já existe um usuário cadastrado com este e-mail.'
    });
  }

  const safeRole = ['patient', 'secretary'].includes(role) ? role : 'patient';
  const approved = safeRole === 'secretary' ? false : true;

  const user = await User.create({
    name,
    email,
    password,
    role: safeRole,
    approved
  });

  if (safeRole === 'secretary') {
    return res.status(201).json({
      message:
        'Cadastro de secretário realizado com sucesso. Aguarde a aprovação do administrador para acessar o sistema.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approved: user.approved
      }
    });
  }

  return res.status(201).json({
    token: createToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      approved: user.approved
    }
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      message: 'Credenciais inválidas.'
    });
  }

  if (user.role === 'secretary' && !user.approved) {
    return res.status(403).json({
      message:
        'Seu cadastro de secretário ainda não foi aprovado pelo administrador.'
    });
  }

  return res.json({
    token: createToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      approved: user.approved
    }
  });
}

async function me(req, res) {
  return res.json(req.user);
}

module.exports = {
  register,
  login,
  me
};