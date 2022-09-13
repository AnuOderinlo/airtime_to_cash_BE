import { DataTypes, Model} from 'sequelize'
import db from '../config/database.config'

export interface UserAttribute {
    id: string,
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    avatar: string;
    isVerified: boolean
}

export class UserInstance extends Model<UserAttribute> {}

UserInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'First Name cannot be empty'
            },
            notEmpty: {
                msg: 'Please provide a Name'
            }
        }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Last Name cannot be empty'
            },
            notEmpty: {
                msg: 'Please provide a Name'
            }
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Username cannot be empty'
            },
            notEmpty: {
                msg: 'Please provide a Username'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Email cannot be empty'
            },
            isEmail: {
                msg: 'Please provide a valid Email'
            }
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Phone Number cannot be empty'
            },
            notEmpty: {
                msg: 'Please provide a Phone Number'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password cannot be empty'
            },
            notEmpty: {
                msg: 'Please provide a password'
            }
        }
    },
    avatar:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    isVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db,
    tableName: 'Users'
})
