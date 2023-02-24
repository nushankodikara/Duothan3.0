import { prisma } from '$lib/server/prisma';
import { SALT } from '$env/static/private';
import bcrypt from 'bcrypt';

export const POST = async ({ request }) => {
	const body = await request.formData();
	const email = body.get('email');
	const password = body.get('password');
	const username = body.get('username');
	const role = body.get('role');

	const passwordhash = await bcrypt.hash(password, Number(SALT));

	if (!email || !password || !username) {
		return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
	}

	try {
		const user = await prisma.primaryUser.create({
			data: {
				email,
				passwordhash,
				username,
				roleId: role ? role : '63f840a4445fbc9a44508907'
			}
		});

		if (!user) {
			return new Response(JSON.stringify({ message: 'User could not be created.' }), {
				status: 406
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'User already exists.' }), { status: 406 });
	}

	return new Response(JSON.stringify({ message: 'User Created Successfully.' }), { status: 201 });
};
