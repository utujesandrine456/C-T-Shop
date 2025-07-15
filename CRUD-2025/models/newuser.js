require('dotenv').config({ path: './safe.env' });
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const UserModel = require('./user.model.js');
const connectDB = require('./mongodb.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());




app.use(express.json());
app.use(express.static(path.join(__dirname, 'COFFEE PROJECT/CRUD-2025/public')));
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: "GET,POST",
    credentials: true
}));


const JWT_SECRET = process.env.JWT_SECRET || 'securitymustbeyourpriority';
const JWT_EXPIRES_IN = '1h';


const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Your errror is:", error);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        try {
            console.log("User role:", req.user?.role); // Debug log
            console.log("Required roles:", roles); // Debug log
            
            if (!req.user?.role) {
                return res.status(403).json({
                    success: false,
                    message: 'No role assigned to user'
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Role ${req.user.role} is not authorized`,
                    requiredRoles: roles // Show which roles are allowed
                });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};

app.post('/signup', async (req, res) => {
    const { name, email, password, confirm, role } = req.body;
    
    try {
        
        if (password !== confirm) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            });
        }

        
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 
        });

        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    
    try {
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 
        });

        
        res.json({
            success: true,
            token: token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});


app.get('/profile', authenticate, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});



app.get('/admin', authenticate, authorize(['admin']), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome admin',
        secretData: 'Sensitive admin information'
    });
});


app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
});