import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Playlist = sequelize.define('Playlist', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    SongCardId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'SongCards',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

export default Playlist;
