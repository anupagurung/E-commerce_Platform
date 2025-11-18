import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // --- Basic Information ---
    firstName: {
        type: String,
        required: [true, 'Please provide your first name.'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name.'],
        trim: true,
    },
    
    // --- Authentication ---
    email: {
        type: String,
        required: [true, 'Please provide an email address.'],
        unique: true, // Ensures no two users can have the same email
        lowercase: true, // Converts email to lowercase to avoid case-sensitivity issues
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address.'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [8, 'Password must be at least 8 characters long.'],
        select: false, // Prevents the password from being sent back in queries by default
    },
    
    // --- Authorization ---
    role: {
        type: String,
        enum: ['user', 'admin', 'seller'], // Added 'seller' role for e-commerce logic
        default: 'user', // New users are standard users by default
    },
    
    // --- User-specific Data ---
    shippingAddress: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true },
    },
    
    // A list of product IDs that the user has added to their wishlist
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // This creates a relationship with the Product model
    }],

}, {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true 
});

// --- Mongoose Middleware for Password Hashing ---
// This function runs automatically BEFORE a user document is saved ('pre-save').
userSchema.pre('save', async function(next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Generate a "salt" to add randomness to the hash
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


const User = mongoose.model('User', userSchema);

// CORRECT EXPORT: Use ES Module default export
export default User;
