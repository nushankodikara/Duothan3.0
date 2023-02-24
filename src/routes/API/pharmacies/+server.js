import { prisma } from '$lib/server/prisma';

export const GET = async () => {
	try {
		const pharmacies = await prisma.pharmacy.findMany({});

		return new Response(JSON.stringify({ pharmacies }), {
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
