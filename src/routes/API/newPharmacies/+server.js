import { prisma } from '$lib/server/prisma';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_ROLE_ID } from '$env/static/private';

export const GET = async ({ request }) => {
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

		try {
			const pharmacies = await prisma.pharmacy.findMany({
				where: {
					approval: 'pending'
				}
			});

			return new Response(JSON.stringify(pharmacies), {
				status: 200
			});
		} catch (error) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
