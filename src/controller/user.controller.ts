import { Handler } from 'hono';
import type { StatusCode } from 'hono/utils/http-status'
import httpStatus from 'http-status';

import { PrismaClient } from '@prisma/client/edge';
import { IcreateUser } from '../interface/iUser';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "prisma://aws-eu-central-1.prisma-data.com/?api_key=EqfkqHRTYzVhCxy9qvSI15lG9aKj2AX37Msz-bWt8oyIJJsuJaFWFTRA_SUIjYpd"
        }
    }
})

export const createUser: Handler = async (c) => {
    const { firstName, lastName, email, password, addressFacturation, addressLivraison } = await c.req.json<IcreateUser>();

    const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,3})$/i;

    if (!firstName.trim()) return c.json({ message: 'Please enter your firstName !!!!', status: httpStatus[406] }, 406);
    if (!lastName.trim()) return c.json({ message: 'Please enter your lastName !!!!', status: httpStatus[406] }, 406);

    if (!email.trim()) return c.json({ message: 'Please enter your email !!!!', status: httpStatus[406] }, 406);

    const emailValidator = EMAIL_REGEX.test(email);
    if (!emailValidator) return c.json({ message: 'Email incorrect !!!!', status: httpStatus[406] }, 406);

    if (!password.trim()) return c.json({ message: 'Please enter your password !!!!', status: httpStatus[406] }, 406);


    // By unique email
    const existUserWithEmail = await prisma.user.findUnique({
        where: {
            email: email,
        },
    })

    if (existUserWithEmail) {
        return c.json({ message: 'User exist with this email !!!!', status: httpStatus[409] }, 409)
    } else {
        try {

            const newUser = await prisma.user.create({
                data: {
                    role: 'User',
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    address: {
                        addressFacturation: addressFacturation,
                        addressLivraison: addressLivraison,
                    },
                }
            })

            if (newUser) {
                const url = "https://lawyer-email.rogerranium.workers.dev/register/" + email + "/" + firstName + " " + lastName
                const response = await fetch(url)
                if (response.ok) {
                    return c.json({ message: "User created successfull !!!", email: "Email sent successfull !!!", user: newUser }, httpStatus.CREATED as StatusCode)
                }
            }
        } catch (error) {
            return c.json({ message: 'Error created user !!!!', status: httpStatus.INTERNAL_SERVER_ERROR }, httpStatus.INTERNAL_SERVER_ERROR as StatusCode)
        }

    }

    return c.json("", httpStatus.CREATED as StatusCode)
}

export const getUsers: Handler = async (c) => {
    const users = await prisma.user.findMany()


    if (users.length > 0) {
        return c.json({ users: users }, httpStatus.OK as StatusCode)
    } else {
        return c.json({ users: "No Content" }, httpStatus.OK as StatusCode)
    }
}