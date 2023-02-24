import { prisma } from '$lib/server/prisma';

export const GET = async ({ params }) => {
	const { medID } = params;
	// send the list of batches for the medicine in the pharmacy
	try {
		try {
			const batches = await prisma.availability.findMany({
				where: {
					medicineId: medID
				}
			});

			return new Response(JSON.stringify({ batches }), {
				status: 200
			});
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
