const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

module.exports = {
    async get(req, res){
        const user = await prisma.user.findMany({
            include: {
                toDoList: true
            },
        });
        res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Berhasil menampilkan data',
            data: user
        })
    },

    async getById(req, res){
        const user = await prisma.user.findUnique({
            where: {
                id: +req.params.id,
            },
            include: {
                toDoList: true
            }
        })
        res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Data berhasil ditampilkan!',
            data: user
        })  
    },

    async create(req, res){
        try {
            console.log(req.body)
            const user=await prisma.user.create({
                data: 
                {
                    email: req.body.email,
                    name: req.body.name,
                    pin: await encryptPassword(req.body.pin),
                    toDoList: 
                    {
                      create: 
                        {
                            toDo: 'Membuat Akun',
                            status: true,
                        }
                    }
                },
                include:{
                    toDoList:true
                } 
            })
            return res.status(201).json({ 
                status: 'success', 
                code: 201, 
                message: 'Data ditambahkan!',
                data: user
            })
        } catch (error) {
            return res.status(400).json({ 
                status: 'failed', 
                code: 400, 
                message: 'Gagal menambah data, terdapat data yang kosong atau salah',
            })
        }        
    },

    async destroy(req, res){
        const deleteToDoList = await prisma.toDoList.delete({
            where: {
                userId: +req.params.id,
            },
        })

        const deletedData = await prisma.user.delete({
            where: {
                id: +req.params.id,
            },
        }); 
        res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Success Data terhapus!',
        })
    },
}