import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../sequelize';

const { INTEGER, BIGINT, STRING } = DataTypes;

interface MessageAttributes {
    user_id: string;
    message_count: number;
    count_symbol: number;
}

interface MessageCreateAt extends Optional<MessageAttributes, 'user_id'> { };

export class MessageDB extends Model<MessageAttributes, MessageCreateAt> implements MessageAttributes { 
    public user_id!: string;
    public message_count!: number;
    public count_symbol!: number;

    public async findOneUser(user_id: string): Promise<MessageDB | null> {
        return MessageDB.findOne({
            where: { user_id }
        });
    }
};

MessageDB.init({
    user_id: {
        type: STRING,
        primaryKey: true,
    },
    message_count: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
    count_symbol: {
        type: BIGINT,
        primaryKey: false,
        defaultValue: 0,
        allowNull: false
    },
}, { sequelize, tableName: 'messages', createdAt: false, timestamps: false });
