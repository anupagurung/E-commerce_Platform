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
        select: false, 
    },
    
    // --- Authorization ---
    role: {
        type: String,
        enum: ['user', 'admin', 'seller'], 
        default: 'user',
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
        ref: 'Product' 
    }],

}, {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true 
});

// --- Mongoose Middleware for Password Hashing ---

userSchema.pre('save', async function(next) {
   
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


const User = mongoose.model('User', userSchema);

export default User;
