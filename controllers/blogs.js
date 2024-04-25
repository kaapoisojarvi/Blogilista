const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    try{
        const blogs = await Blog.find({})
        response.json(blogs)

    }catch (error) {
        next(error)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    try{
        const body = request.body

        if (!body.title || !body.url) {
            return response.status(400).json({ error: 'title or url missing' })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0
        })

        const result = await blog.save()
        return response.status(201).json(result)

    }catch (error) {
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(request.params.id)
        if (blog) {
            response.status(204).end()
        } else {
            response.status(404).json({ error: 'Blog not found' })
        }
    } catch (error) {
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const body = request.body

        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
        }

        Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
            .then(updatedBlog => {
                response.json(updatedBlog)
            })

    } catch (error) {
        next(error)
    }
})


module.exports = blogsRouter