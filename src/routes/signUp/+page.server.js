import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { SALT } from '$env/static/private';

/** @type {import('./$types').PageLoad} */
export async function load({ cookies }) {
	if (cookies.get('userID')) {
		const user = await prisma.primaryUser.findUnique({
			where: {
				id: cookies.get('userID')
			}
		});

		if (user) {
			throw redirect(301, '/');
		}
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		try {
			const { username, email, password } = Object.fromEntries(await request.formData());

			console.log(username, email, password);

			const hashedPassword = await bcrypt.hash(password, SALT);

			const user = await prisma.primaryUser.create({
				data: {
					username,
					email,
					passwordhash: hashedPassword
				}
			});

			if (!user) {
				throw redirect(301, '/signUp');
			}

			throw redirect(301, '/signIn');
		} catch (e) {
			console.log(e);
		}
	}
};
