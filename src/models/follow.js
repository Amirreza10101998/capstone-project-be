import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Follow = sequelize.define('Follow', {
    followerId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    followeeId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

export default Follow
