import Users from "../models/Users.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    try{
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }
        const email = req.body.email.trim().toLowerCase();
        const existingUser = await Users.findOne({email: email});
        if(existingUser){
            return res.status(400).json({message: "Email Sudah Terdaftar"});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new Users({
                "email": req.body.email,
                "password": hashedPassword
            });
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
        message: "Register Berhasil!",
        user: userResponse
        });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

export const login = async (req, res) => {
    try {
        if (!req.body.user || !req.body.password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }
        const user = await Users.findOne({
                                            $or: [
                                                { email: req.body.user },
                                                { username: req.body.user }
                                            ]
                                        }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        const isMatch = await user.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Password salah"
            });
        }

        const userResponse = user.toObject();
        delete userResponse.password;
        res.json({
            message: "Login Berhasil!",
            user: userResponse
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};