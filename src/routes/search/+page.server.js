import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	if (cookies.get('medId')) {
		throw redirect(302, '/search/' + cookies.get('medId'));
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		try {
			const { medName } = Object.fromEntries(await request.formData());
			console.log(medName);

			const med = await prisma.medicine.findMany({
				where: {
					name: medName
				}
			});

			if (!med) {
				throw new Error('Medication does not exist.');
			}

			cookies.set('medId', med[0].id, { path: '/' });
		} catch (e) {
			console.log(e);
		}
	}
};
