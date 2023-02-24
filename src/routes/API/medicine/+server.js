import { prisma } from '$lib/server/prisma';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_ROLE_ID } from '$env/static/private';

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

		const body = await request.formData();
		const name = body.get('name');
		const dosage = body.get('dosage');
		const price = body.get('price');

		if (!name || !dosage || !price) {
			return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
		}

		try {
			const medicine = await prisma.medicine.findMany({
				where: {
					name
				}
			});

			for (let i in medicine) {
				if (medicine[i].dosage == dosage) {
					return new Response(JSON.stringify({ message: 'Medicine already exists.' }), {
						status: 400
					});
				}
			}
		} catch (error) {
			console.log(error);
			return new Response(JSON.stringify({ message: 'Something went wrong.' }), { status: 500 });
		}

		try {
			const medicine = await prisma.medicine.create({
				data: {
					name,
					dosage,
					price: Number(price)
				}
			});

			return new Response(JSON.stringify({ medicine }), { status: 201 });
		} catch (error) {
			console.log(error);
			return new Response(JSON.stringify({ message: 'Something went wrong.' }), { status: 500 });
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
