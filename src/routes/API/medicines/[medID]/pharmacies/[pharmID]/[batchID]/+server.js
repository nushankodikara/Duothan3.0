import { prisma } from '$lib/server/prisma';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, PHARM_ROLE_ID } from '$env/static/private';

export const GET = async ({ request, params }) => {
	const { pharmID, medID } = params;
	// send the list of batches for the medicine in the pharmacy
	try {
		const token = request.headers.get('Authorization').split(' ')[1];

		const decode = verify(token, JWT_SECRET);

		const user = await prisma.primaryUser.findUnique({
			where: {
				id: decode.id
			}
		});

		if (!user) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}

		if (user.roleId != PHARM_ROLE_ID) {
			return new Response(JSON.stringify({ message: 'Not Authorized.' }), {
				status: 401
			});
		}

		try {
			const batches = await prisma.availability.findMany({
				where: {
					medicineId: medID,
					pharmacyId: pharmID
				}
			});

			return new Response(JSON.stringify({ batches }), {
				status: 200
			});
		} catch (error) {
			console.log(error);
			return new Response(JSON.stringify({ message: 'Cannot Read the Requested Item.' }), {
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
	const { batchID } = params;
	// update the batch
	try {
		const token = request.headers.get('Authorization').split(' ')[1];

		const decode = verify(token, JWT_SECRET);

		const user = await prisma.primaryUser.findUnique({
			where: {
				id: decode.id
			}
		});

		if (!user) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}

		if (user.roleId != PHARM_ROLE_ID) {
			return new Response(JSON.stringify({ message: 'Not Authorized.' }), {
				status: 401
			});
		}

		const body = await request.formData();
		const quantity = body.get('quantity');
		try {
			const batch = await prisma.availability.update({
				where: {
					id: batchID
				},
				data: {
					quantity: Number(quantity)
				}
			});

			return new Response(JSON.stringify({ batch }), {
				status: 200
			});
		} catch (error) {
			console.log(error);
			return new Response(JSON.stringify({ message: 'Cannot Update the Requested Item.' }), {
				status: 404
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};

export const DELETE = async ({ request, params }) => {
	const { batchID } = params;
	// delete the batch
	try {
		const token = request.headers.get('Authorization').split(' ')[1];

		const decode = verify(token, JWT_SECRET);

		const user = await prisma.primaryUser.findUnique({
			where: {
				id: decode.id
			}
		});

		if (!user) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}

		if (user.roleId != PHARM_ROLE_ID) {
			return new Response(JSON.stringify({ message: 'Not Authorized.' }), {
				status: 401
			});
		}

		try {
			const batch = await prisma.availability.delete({
				where: {
					id: batchID
				}
			});

			return new Response(JSON.stringify({ batch }), {
				status: 200
			});
		} catch (error) {
			console.log(error);
			return new Response(JSON.stringify({ message: 'Cannot Delete the Requested Item.' }), {
				status: 404
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
