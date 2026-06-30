import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Password can be null for OAuth logins
  discordId: { type: String, default: null }, // Linked Discord account ID
  discordUsername: { type: String, default: null },
  discordAvatar: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin', 'top_spender'], default: 'user' },
   coins: { type: Number, default: 0 },
  spentCoins: { type: Number, default: 0 },
  totalTopUp: { type: Number, default: 0 },
  robloxId: { type: String, default: null },
  robloxUsername: { type: String, default: null },
  robloxDisplayName: { type: String, default: null },
  robloxApiKey: { type: String, default: null },
  robloxCookie: { type: String, default: null }, // Added for downloading private assets
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
