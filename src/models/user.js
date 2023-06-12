import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import Post from '../models/post.js'

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    avatar: {
        type: DataTypes.STRING,
    },
    favorite_genres: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    favorite_artists: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    password: {
        type: DataTypes.STRING,
    },
    refreshToken: {
        type: DataTypes.STRING,
    },
    googleId: {
        type: DataTypes.STRING,
    },

}, {
    timestamps: true,
});

User.beforeCreate(async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

User.prototype.toJSON = function () {
    const user = { ...this.get() };
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
};

User.checkCredentials = async function (email, plainPw) {
    const user = await this.findOne({ where: { email } });
    if (user) {
        const match = await bcrypt.compare(plainPw, user.password);
        if (match) {
            return user;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

User.prototype.getPostCount = async function () {
    return await Post.count({
        where: {
            user_id: this.id,
        },
    });
};

export default User;
