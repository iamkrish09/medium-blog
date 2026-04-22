import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '@prisma/client/edge';
import { verify } from "hono/jwt";

export const postRouter = new Hono<{
    Bindings: {
		DATABASE_URL: string,
        JWT_SECRET: string
	},
    Variables: {
        userId: string,
    }
}>();

postRouter.use("/*", async(c, next) => {
    //extract the user id
    //pass it down to the route handler
        const authHeader = c.req.header("authorization") || "";

        try{
            //Bearer Token
            const token = authHeader.split(" ")[1]

            const response = await verify(token, c.env.JWT_SECRET)
            // const user = await verify(authHeader, c.env.JWT_SECRET);
            if (response.id) {
                c.set('userId', response.id as string);
                await next()
            } 
            else{
                c.status(403)
                return c.json({error: "unauthorized"})
            } 
        } catch(e){
            c.status(403)
            return c.json({error: "unauthorized"})
        }
    }
)




postRouter.post('/', async(c) => {
    //Get the body which the user will send me
    const body = await c.req.json();

    const authorId = c.get("userId");

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.create({
        data:{
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
    //Get the body which the user will send me
    const body = await c.req.json();

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.update({
        where:{
            id:body.id
        },    
        data:{
            title: body.title,
            content: body.content,
        }
        })

        c.status(200);
        return c.json({
            id: post.id,
            message: 'Post updated successfully!',      
        })

    } catch (e) {
        c.status(411);
        return c.text('error occured while updating  post')
    }
})


//You should add pagination here
postRouter.get('/bulk', async(c) => {

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const posts = await prisma.post.findMany();

    return c.json({
      posts  
    })
})


postRouter.get('/:id', async(c) => {
//Get the body which the user will send me
    const id = c.req.param("id");

    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const post = await prisma.post.findFirst({
        where:{
            id:id
        },    
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
