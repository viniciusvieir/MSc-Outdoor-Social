const JWT = require('jsonwebtoken')

const { compareSync } = require('bcryptjs')
const { DataTypes, Model } = require('sequelize')

const JWT_SECRET = process.env.JWT_SECRET

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER(11),
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
      }
    )

    return this
  }

  verifyPassword(password, encodedPassword) {
    return compareSync(password, encodedPassword)
  }

  generateTokenPayload() {
    const payload = {
      id: this.id,
      email: this.email,
    }

    const token = JWT.sign(payload, JWT_SECRET, {
      expiresIn: '28d',
    })

    return { token }
  }
}

module.exports = User
