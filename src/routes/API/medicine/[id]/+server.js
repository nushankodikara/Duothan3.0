import { prisma } from '$lib/server/prisma';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_ROLE_ID } from '$env/static/private';

export const GET = async ({ request, params }) => {
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
			const medicine = await prisma.medicine.findUnique({
				where: {
					id
				}
			});

			return new Response(JSON.stringify(medicine), { status: 200 });
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

export const PUT = async ({ request, params }) => {
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

		const body = await request.formData();
		const name = body.get('name');
		const dosage = body.get('dosage');
		const price = body.get('price');

		if (!name || !dosage || !price) {
			return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
		}

		try {
			const medicine = await prisma.medicine.update({
				where: {
					id
				},
				data: {
					name,
					dosage,
					price: Number(price)
				}
			});

			return new Response(JSON.stringify(medicine), { status: 200 });
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

export const DELETE = async ({ request, params }) => {
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
			const medicine = await prisma.medicine.delete({
				where: {
					id
				}
			});

			return new Response(JSON.stringify(medicine), { status: 200 });
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
