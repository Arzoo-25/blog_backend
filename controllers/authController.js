const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser =(req,res)=>{
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
    db.query(sql, [username, email, hashedPassword],(err,result)=>{
        if(err){
            return res.status(500).json({message: 'Error registering user', error: err});
        }
        res.status(201).json({message: 'User registered successfully'});
    });
};

const loginUser =(req,res)=>{
    const {email, password} =req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err,results)=>{
        if(err || results.length === 0){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if(!isMatch){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET,{expiresIn: '1d'});
        res.status(200).json({message: 'Login successful', token, user: {id: user.id, username: user.username}});

    });
};

module.exports = {registerUser, loginUser};