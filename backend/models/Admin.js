import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});

AdminSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
