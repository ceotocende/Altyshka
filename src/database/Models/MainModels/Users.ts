import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../sequelize';

const { INTEGER, BIGINT, STRING } = DataTypes;

interface UserAttributes {
    user_id: string;
    first_currency: number;
    second_currency: number;
    exp: number;
    rank: number;
    voice: number;
}

interface UsersCreateAt extends Optional<UserAttributes, 'user_id'> { };

export class Users extends Model<UserAttributes, UsersCreateAt> implements UserAttributes { 
    public user_id!: string;
    public first_currency!: number;
    public second_currency!: number;
    public exp!: number;
    public rank!: number;
    public voice!: number;

    public async findOneUser(user_id: string): Promise<Users | null> {
        return Users.findOne({
            where: { user_id }
        });
    }
};

Users.init({
    user_id: {
        type: STRING,
        primaryKey: true,
    },
    first_currency: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    second_currency: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    exp: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    rank: {
        type: INTEGER,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    voice: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    }
}, { sequelize, tableName: 'users', createdAt: false, timestamps: false });
