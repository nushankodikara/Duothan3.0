import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

/** @type {import('./$types').PageLoad} */
export async function load({ cookies }) {
	const user = await prisma.primaryUser.findUnique({
		where: {
			id: cookies.get('userID')
		}
	});

	if (user) {
		throw redirect(301, '/');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		try {
			const { email, password } = Object.fromEntries(await request.formData());

			console.log(email, password);

			const user = await prisma.primaryUser.findUnique({
				where: {
					email
				}
			});

			if (!user) {
				throw new Error('User does not exist.');
			}

			const check = await bcrypt.compare(password, user.passwordhash);

			if (!check) {
				throw new Error('Incorrect password.');
			}

			cookies.set('userID', user.id, { path: '/' });

			throw redirect(301, '/');
		} catch (e) {
			console.log(e);
		}
	}
};
