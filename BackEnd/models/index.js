const User = require('./User')
const Pet = require('./Pet')

// =============================
// RELACIONAMENTO: DONO DO PET
// =============================

// Um usuário possui vários pets (que ele cadastrou)
User.hasMany(Pet, {
  foreignKey: 'userId',
  as: 'pets'
})

// Cada pet pertence a um usuário (dono)
Pet.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner'
})

// ==================================
// RELACIONAMENTO: ADOTANTE DO PET
// ==================================

// Um usuário pode adotar vários pets
User.hasMany(Pet, {
  foreignKey: 'adopterId',
  as: 'adoptions'
})

// Um pet pode ter um adotante
Pet.belongsTo(User, {
  foreignKey: 'adopterId',
  as: 'adopter'
})

// Exporta os models
module.exports = {User, Pet}