import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole } from '../constants/types';

export interface IUser extends Document {
  role: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  banned: boolean;
  password: string;
  username: string;
  resetPasswordToken: string;
  facebookId: string;
  googleId: string;
  githubId: string;
  image: string;
  imagePublicId: string;
  about: string;
  website: string;
  coverImage: string;
  coverImagePublicId: string;
  isOnline: boolean;
  posts: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  notifications: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  isValidPassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    role: {
      type: String,
      required: true,
      default: UserRole.Regular,
      enum: Object.values(UserRole),
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    resetPasswordToken: String,
    facebookId: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      default: '',
    },
    githubId: {
      type: String,
      default: '',
    },
    image: String,
    imagePublicId: String,
    about: String,
    website: String,
    coverImage: String,
    coverImagePublicId: String,
    isOnline: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (this.password) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this as IUser;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

export default mongoose.model<IUser, Model<IUser>>('User', UserSchema);
