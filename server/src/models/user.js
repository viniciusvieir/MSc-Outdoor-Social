const JWT = require('jsonwebtoken')

const bcrypt = require('bcryptjs')
const { DataTypes, Model } = require('sequelize')

const JWT_SECRET = process.env.JWT_SECRET

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dob: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        gender: {
          type: DataTypes.CHAR(1),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['email'],
          },
        ],
        hooks: {
          beforeCreate: (user) => {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync())
          },
          beforeUpdate: (user) => {
            if (user.changed('password')) {
              user.password = bcrypt.hashSync(
                user.password,
                bcrypt.genSaltSync()
              )
            }
          },
        },
      }
    )

    return this
  }

  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password)
  }

  generateTokenPayload() {
    const payload = {
      id: this.id,
      email: this.email,
    }

    const token = JWT.sign(payload, JWT_SECRET, {
      expiresIn: '28d',
    })

    return {
      token,
      name: this.name,
      email: this.email,
    }
  }
}

module.exports = User
