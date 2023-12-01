const { PrismaClient } = require('@prisma/client');
const { encryptPin, checkPin } = require('../../utils/auth');
const { JWTsign } = require('../../utils/jwt');


const prisma = new PrismaClient();

module.exports = {
    async login(req, res){
        
        const{email, pin} = req.body;

        const user = await prisma.user.findFirst({
            where:{ email }
        })
        
        if(!user){
            return res.status(404).json({
                status: "Fail!",
                message:"Email tidak ditemukan!"
            })
        }

        const isPinCorrect =  await checkPin(
            pin, user.pin
        )

        delete user.pin
        const token = await JWTsign(user)

        if(!isPinCorrect){
            return res.status(401).json({
                status: "Fail!",
                message: "Pin Salah!"
            })
        }
        

        return res.status(201).json({
            status: "Success!",
            message:"Berhasil Login",
            data:{user, token}
        })
    },

    async register(req, res){
        const { email, name, pin } = req.body;
        if (isNaN(+pin) || pin.length !== 6) {
            return res.status(400).json({
                status: 'Fail!',
                message: 'PIN harus berupa angka dengan panjang 6 digit.'
            });
        }
        const user = await prisma.user.findFirst({
            where: { email }
        })
        
        if(user){
            return res.status(404).json({
                status:"Fail!",
                message: "Email sudah terdaftar!"
            })
        }

        const createUser = await prisma.user.create({
            data:{
                email,
                name,
                pin : await encryptPin(pin)
            }
        })

        return res.status(201).json({
            status: 'success',
            code: 200,
            message: 'Berhasil mendaftar',
            data: createUser
        })
    },

    async registerForm(req, res){
        const { email, name, pin } = req.body;
        const user = await prisma.user.findFirst({
            where: { email }
        })
        if (isNaN(+pin) || pin.length !== 6) {
            req.flash("error","PIN harus berupa angka dengan panjang 6 digit.")
            return res.redirect('/register')
        }
        
        if(user){
            req.flash("error","Email sudah terdaftar!")
            return res.redirect('/register')
        }

        const createUser = await prisma.user.create({
            data:{
                email,
                name,
                pin : await encryptPin(pin)
            }
        })

        req.flash("success", "Berhasil Register")
        return res.redirect('/login')
    },

    authUser: async (email, pin, done)=>{
        try {
            const user = await prisma.user.findUnique({
                where: {email}
            })
            if(!user || !await checkPin(pin, user.pin)){
                return done(null,  false,  {message: 'Invalid email or pin'})
            }

            return done(null, user)
        } catch (err) {
            return done(null, false, {message: err.message})
        }
    },

    getDashboard: async (req, res) => {
        try {
            const userId = req.user.id;
            const todos = await prisma.toDoList.findMany({
                where: { userId },
            });
            
            res.render('dashboard.ejs', { todos });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Error Dashboard' });
        }
    },

    addTodo: async (req, res) => {
        try {
            const newTodo = req.body.newTodo;
            
            const userId = req.user.id;
            
            const todo = await prisma.toDoList.create({
                data: {
                    toDo: newTodo,
                    status: false, 
                    userId: userId,
                },
            });
        
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Error Add Todo' });
        }
    },

    updateStatus: async (req, res) => {
        try {
        
            const todoId = +req.params.id
        
            const todo = await prisma.toDoList.findFirst({ where: { id: todoId } });
        
            if (!todo) {
                return res.status(404).json({ message: 'To-do tidak ditemukan' });
            }
        
            const updatedTodo = await prisma.toDoList.update({
                where: { id: todoId },
                data: { status: !todo.status },
            });
        
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Error Update' });
        }
    }
}