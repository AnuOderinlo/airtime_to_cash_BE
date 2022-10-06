import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';
import { AccountInstance } from "./accountsModel";
import { TransactionsInstance } from './transactionsModel';

interface UserAttribute {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  avatar: string;
  isVerified: boolean;
  wallet?: number;
}

export class UserInstance extends Model<UserAttribute> {
  [x: string]: any;
}

UserInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First Name cannot be empty',
        },
        notEmpty: {
          msg: 'Please provide a Name',
        },
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last Name cannot be empty',
        },
        notEmpty: {
          msg: 'Please provide a Name',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username cannot be empty',
        },
        notEmpty: {
          msg: 'Please provide a Username',
        },
      },
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email cannot be empty',
        },
        isEmail: {
          msg: 'Please provide a valid Email',
        },
      },
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone Number cannot be empty',
        },
        notEmpty: {
          msg: 'Please provide a Phone Number',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password cannot be empty',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOA8-aNtpaUiEp2YmB9QCAAtGGjvhRtGZ1Fb_-Mcc-XWPPNF0moeotjN_R-hYjv9PJDP4&usqp=CAU',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    wallet: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: 0,
    }
  },
  {
    sequelize: db,
    tableName: 'Users',
  },
);

UserInstance.hasMany(AccountInstance, { foreignKey: "userId", as: "account" });
UserInstance.hasMany(TransactionsInstance, { foreignKey: "userId", as: "Transactions" });

AccountInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "user" });
TransactionsInstance.belongsTo(UserInstance, { foreignKey: "userId", as: "user" });
