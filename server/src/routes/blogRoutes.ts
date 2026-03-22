import express from 'express';
import { getBlogs, getBlogById, createBlog } from '../controllers/blogController';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);

export default router;
