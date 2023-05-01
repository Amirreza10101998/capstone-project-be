import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SongCard = sequelize.define('SongCard', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    song_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    album_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    album_art: {
        type: DataTypes.STRING,
    },
    song_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default SongCard;
