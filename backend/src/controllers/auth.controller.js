const jwt = require('jsonwebtoken');
const User = require('../models/User');
function createToken(user) { return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' }); }
async function register(req, res) {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'E-mail já cadastrado' });
  const user = await User.create({ name, email, password, role: role || 'patient' });
  res.status(201).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}
async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Credenciais inválidas' });
  res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}
async function me(req, res) { res.json(req.user); }
module.exports = { register, login, me };
