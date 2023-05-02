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
    spotify_id: { // Rename the column from 'spotify_track_id' to 'spotify_id'
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Add this to ensure that the spotify_id is unique
    },
    song_artists: { // Add the 'song_artists' column
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default SongCard;
