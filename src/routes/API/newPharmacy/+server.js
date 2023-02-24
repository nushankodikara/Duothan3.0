import { prisma } from '$lib/server/prisma';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, PHARM_ROLE_ID } from '$env/static/private';

export const POST = async ({ request }) => {
	try {
		const token = request.headers.get('Authorization').split(' ')[1];

		const decode = verify(token, JWT_SECRET);

		try {
			const user = await prisma.primaryUser.findUnique({
				where: {
					id: decode.id
				}
			});

			if (user.roleId != PHARM_ROLE_ID) {
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

		const body = await request.formData();
		const email = body.get('email');
		const name = body.get('name');
		const address = body.get('address');
		const phone = body.get('phone');
		const lon = body.get('lon');
		const lat = body.get('lat');

		try {
			const check = await prisma.pharmacy.findMany({
				where: {
					name
				}
			});

			for (let i in check) {
				if (check[i].address == address) {
					return new Response(JSON.stringify({ message: 'Pharmacy Already Exists.' }), {
						status: 400
					});
				}
			}
		} catch (error) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}

		if (!email || !name || !address || !phone || !lon || !lat)
			return new Response(JSON.stringify({ message: 'Invalid Request.' }), {
				status: 400
			});

		try {
			const pharmacy = await prisma.pharmacy.create({
				data: {
					name,
					address,
					lon,
					lat,
					phone,
					email
				}
			});

			return new Response(JSON.stringify(pharmacy), { status: 201 });
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
