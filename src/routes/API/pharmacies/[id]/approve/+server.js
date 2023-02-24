import { prisma } from '$lib/server/prisma';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_ROLE_ID } from '$env/static/private';

export const POST = async ({ request, params }) => {
	try {
		const token = request.headers.get('Authorization').split(' ')[1];

		const decode = verify(token, JWT_SECRET);

		try {
			const user = await prisma.primaryUser.findUnique({
				where: {
					id: decode.id
				}
			});

			if (user.roleId != ADMIN_ROLE_ID) {
				return new Response(JSON.stringify({ message: 'Not Authorized.' }), {
					status: 401
				});
			}

			if (!user) {
				return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
					status: 401
				});
			}
		} catch (error) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}

		const { id } = params;

		try {
			const pharm = await prisma.pharmacy.findUnique({
				where: {
					id
				}
			});

			if (!pharm) {
				return new Response(JSON.stringify({ message: 'Not Found.' }), {
					status: 404
				});
			}

			const update = await prisma.pharmacy.update({
				where: {
					id
				},
				data: {
					approval: 'accepted'
				}
			});

			if (!update) {
				return new Response(JSON.stringify({ message: 'Cannot Update the Requested Item.' }), {
					status: 500
				});
			}

			return new Response(JSON.stringify(update), { status: 200 });
		} catch (error) {
			console.log(error);
			return new Response(JSON.stringify({ message: 'Cannot Find the Requested Item.' }), {
				status: 404
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
