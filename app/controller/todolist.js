const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

module.exports = {
    async get(req, res){
        const toDoList = await prisma.toDoList.findMany();
        res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Berhasil menampilkan data',
            data: toDoList
        })
    },

    async getById(req, res){
        const toDoList = await prisma.toDoList.findUnique({
            where: {
                id: +req.params.id,
            },
        })
        res.status(201).json({ 
            status: 'success', 
            code: 200, 
            message: 'Data berhasil ditampilkan!',
            data: toDoList
        }) 
    },

    async create(req, res){
        console.log(req.body)
        try {
            
            const user = await prisma.user.findUnique({
                where: {
                    id: +req.body.userId,
                },
            })
            
            const toDoList = await prisma.toDoList.create({
                data:{
                    toDo: req.body.toDo,
                    status: req.body.status,
                    userId: +req.body.userId
                }
            });
            
            return res.status(201).json({ 
                status: 'success', 
                code: 200, 
                message: 'Data ditambahkan!',
                data: toDoList
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
        const deletedData = await prisma.toDoList.delete({
            where: {
                id: +req.params.id,
            },
        });

        return res.status(200).json({ 
            status: 'success', 
            code: 200, 
            message: 'Success Data terhapus!',
        })
    },
}