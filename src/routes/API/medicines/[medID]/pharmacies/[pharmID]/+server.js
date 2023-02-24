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

export const POST = async ({ request, params }) => {
	const { pharmID, medID } = params;

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
			const body = await request.formData();
			const quantity = body.get('quantity');
			const batch = body.get('batch');

			const newbatch = await prisma.availability.create({
				data: {
					medicineId: medID,
					quantity: Number(quantity),
					batch,
					pharmacyId: pharmID
				}
			});

			return new Response(JSON.stringify({ newbatch }), {
				status: 200
			});
		} catch (error) {
			console.log(error);
			return new Response(JSON.stringify({ message: 'Cannot Create the Requested Item.' }), {
				status: 404
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
