import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const POST = async ({ request }) => {
	const body = await request.formData();
	const email = body.get('email');
	const password = body.get('password');

	if (!email || !password) {
		return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
	}

	const user = await prisma.primaryUser.findUnique({
		where: {
			email
		}
	});

	if (!user) {
		return new Response(JSON.stringify({ message: 'User does not exist.' }), { status: 404 });
	}

	const check = await bcrypt.compare(password, user.passwordhash);

	if (!check) {
		return new Response(JSON.stringify({ message: 'Incorrect password.' }), { status: 401 });
	}

	const token = sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, {
		expiresIn: '1h'
	});

	return new Response(JSON.stringify({ message: 'User logged in successfully.', token }), {
		status: 200
	});
};
