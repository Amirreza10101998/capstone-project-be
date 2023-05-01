import User from './user.js';
import Playlist from './playlist.js';
import SongCard from './songCard.js';
import UserSongPreferences from './UserSongPreferences.js';
import Post from './post.js';

const associateModels = () => {
    User.hasMany(Playlist, { foreignKey: 'user_id' });
    Playlist.belongsTo(User, { foreignKey: 'user_id' });

    User.belongsToMany(SongCard, { through: UserSongPreferences, foreignKey: 'user_id' });
    SongCard.belongsToMany(User, { through: UserSongPreferences, foreignKey: 'song_id' });

    Playlist.belongsToMany(SongCard, { through: 'playlist_song_cards', foreignKey: 'playlist_id' });
    SongCard.belongsToMany(Playlist, { through: 'playlist_song_cards', foreignKey: 'song_id' });

    Post.belongsTo(User, { foreignKey: 'user_id' });
    Post.belongsTo(Playlist, { foreignKey: 'playlist_id' });
};

export default associateModels;
