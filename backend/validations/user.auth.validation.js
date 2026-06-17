import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('enter a valid email'),

  password: z
    .string()
    .trim()
    .min(2, 'password should be atleast 2 characters long')
    .max(100, 'name should not be too long')

});


export const signUpSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, 'name should be atleast 2 characters long ')
    .max(100, 'name should not be too long'),

    email: z
    .string()
    .trim()
    .email('please enter a valid email'),


  password: z
    .string()
    .trim()
    .min(2, 'password should be atleast 2 characters long')
    .max(100, 'name should not be too long')

});