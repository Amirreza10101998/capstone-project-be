import User from './user.js';
import Playlist from './playlist.js';
import SongCard from './songCard.js';
import UserSongPreferences from './userSongPreferences.js';
import Post from './post.js';

const associateModels = () => {
    User.hasMany(Playlist, { foreignKey: 'user_id' });
    Playlist.belongsTo(User, { foreignKey: 'user_id' });

    User.belongsToMany(SongCard, { through: UserSongPreferences, foreignKey: 'user_id' });
    SongCard.belongsToMany(User, { through: UserSongPreferences, foreignKey: 'song_id' });

    // Add these associations
    UserSongPreferences.belongsTo(SongCard, { foreignKey: 'song_id' });
    UserSongPreferences.belongsTo(User, { foreignKey: 'user_id' });
    SongCard.hasMany(UserSongPreferences, { foreignKey: 'song_id' });
    User.hasMany(UserSongPreferences, { foreignKey: 'user_id' });

    Playlist.belongsToMany(SongCard, { through: 'playlist_song_cards', foreignKey: 'playlist_id' });
    SongCard.belongsToMany(Playlist, { through: 'playlist_song_cards', foreignKey: 'song_id' });

    Post.belongsTo(User, { foreignKey: 'user_id' });
    Post.belongsTo(Playlist, { foreignKey: 'playlist_id' });
};

export default associateModels;
