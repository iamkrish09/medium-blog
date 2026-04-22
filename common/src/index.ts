import z from "zod";

//SignUp Validiation
export const signupInput = z.object({
    email:z.email(),
    password: z.string().min(6),
    name:z.string().optional()
})

// NOTE: type inferencein zod (so that the frontend engineers can understand the data type)
export type SignupInput = z.infer<typeof signupInput>

//SignIn Validiation
export const signinInput = z.object({
    email:z.email(),
    password: z.string().min(6),
})

export type SigninInput = z.infer<typeof signinInput>


/*
!
!
!
Create Post Validiation
!
!
!
*/

//Create Blog Post
export const createPostInput = z.object({
    title:z.string(),
    content: z.string(),
})

export type CreatePostInput = z.infer<typeof createPostInput>

//Update Blog Poste
export const updatePostInput = z.object({
    title:z.string(),
    content: z.string(),
    id:z.string(),
})

export type UpdatePostInput = z.infer<typeof updatePostInput>