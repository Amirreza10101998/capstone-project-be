import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserSongPreferences = sequelize.define('UserSongPreferences', {
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
    song_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'SongCards',
            key: 'id',
        },
    },
    liked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    disliked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default UserSongPreferences;
