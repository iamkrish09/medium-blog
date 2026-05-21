import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../generated/prisma/edge';
import { createPostInput, updatePostInput } from "@krishna1505/medium-common";
import { authMiddleware } from '../middlewares/auth';

export const postRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string,
    }
}>();

// Cookie-based auth middleware (shared with user router)
postRouter.use("/*", authMiddleware);




postRouter.post('/', async (c) => {
    //Get the body which the user will send me
    const body = await c.req.json();

    const { success } = createPostInput.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({ message: "Invalid Input" });
    }

    const authorId = c.get("userId");

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId,
                //if the authorId was a number then we should have used
                //authorId: Number(authorId)
            }
        })

        c.status(200);
        return c.json({
            id: post.id,
            message: 'Post created successfully!',
        })

    } catch (e) {
        c.status(411);
        return c.text('error occured while creating  post')
    }
})

postRouter.put('/', async (c) => {
    const authorId = c.get("userId");
    //Get the body which the user will send me
    const body = await c.req.json();

    const { success } = updatePostInput.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({ message: "Invalid Input" });
    }

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // const post = await prisma.post.update({
        //     where: {
        //         id: body.id
        //     },
        const result = await prisma.post.updateMany({
            where: {
                id: body.id,
                authorId: authorId
            },
            data: {
                title: body.title,
                content: body.content,
            }
        });

        if (result.count === 0) {
            return c.json({ message: "Post not found" }, 404);
        }

        c.status(200);
        return c.json({
            // id: post.id,
            id: body.id,
            message: 'Post updated successfully!',
        })

    } catch (e) {
        c.status(411);
        return c.text('error occured while updating  post')
    }
})


//You should add pagination here
postRouter.get('/bulk', async (c) => {

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json({
        posts
    })
})

postRouter.get('/my-blogs', async (c) => {
    const authorId = c.get("userId");

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: authorId
            },
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({
            posts
        });
    } catch (e) {
        c.status(411);
        return c.json({
            message: "error occurred while fetching my blogs"
        });
    }
})



postRouter.get('/:id', async (c) => {
    //Get the body which the user will send me
    const id = c.req.param("id");

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                content: true,
                title: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })

        c.status(200);
        return c.json({
            post,
            message: 'Post fetched successfully!',
        })

    } catch (e) {
        c.status(411);
        return c.json({
            message: "error occured while fetching post"
        })
    }
})

postRouter.delete('/:id', async (c) => {
    try {
        const id = c.req.param("id"); //post id
        const authorId = c.get("userId");

        // Validate ID
        if (!id) {
            return c.json({ message: "Invalid ID" }, 400);
        }

        const prisma = new PrismaClient({
            accelerateUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Use deleteMany to avoid crashing if id doesn't exist
        const result = await prisma.post.deleteMany({
            // where: { id }
            where: { id, authorId }
        });

        if (result.count === 0) {
            return c.json({ message: "Post not found" }, 404);
        }

        return c.json({
            message: "Post deleted successfully"
        });

    } catch (e) {
        console.error(e);

        const message =
            e instanceof Error ? e.message : "Unknown error";

        return c.json({
            message: "Error deleting post",
            error: message
        }, 500);
    }
});