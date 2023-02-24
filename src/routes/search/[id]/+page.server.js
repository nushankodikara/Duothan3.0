import { prisma } from '$lib/server/prisma';

/** @type {import('./$types').PageLoad} */
export async function load({ cookies, params }) {
	const { id } = params;

	// remove cookie
	cookies.set('medId', '', { path: '/' });

	let data = await prisma.availability.findMany({
		where: {
			medicineId: id
		}
	});

	let pharmas = [];

	for (let i in data) {
		let pharma = await prisma.pharmacy.findUnique({
			where: {
				id: data[i].pharmacyId
			}
		});
		pharmas.push(pharma);
	}

	return { prop: pharmas };
}
