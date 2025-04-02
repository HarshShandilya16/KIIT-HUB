// MongoDB connection helper for serverless functions
const mongoose = require('mongoose');

// Track connection status
let isConnected = false;

// Define the User schema here for direct access in serverless functions
const UserSchema = new mongoose.Schema({
  name: String,
  email_id: { type: String, unique: true },
  password: String,
  college_name: { type: String, default: 'KIIT University' },
  phone_number: String,
  profile_picture: String,
  semester: String,
  branch: String,
  list: [
    {
      title: String,
      price: Number,
      description: String,
      item_type: String,
      cover_image: String,
      created_at: { type: Date, default: Date.now }
    }
  ],
  favourite_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Connect to MongoDB
const connect = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    isConnected = db.connections[0].readyState === 1; // 1 means connected
    console.log('=> Using new database connection');
    return;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Get User model (created on-demand to avoid model overwrite issues)
const getUserModel = () => {
  // Check if the model already exists to prevent overwriting
  return mongoose.models.User || mongoose.model('User', UserSchema);
};

module.exports = {
  connect,
  getUserModel
}; 