import { Request, Response } from 'express';
import Blog from '../models/Blog';

// @desc    Get all blogs
// @route   GET /api/blogs
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().populate('author', 'name image').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name image');
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new blog
// @route   POST /api/blogs
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, author, coverImage, tags } = req.body;
    const blog = new Blog({ title, content, author, coverImage, tags });
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
