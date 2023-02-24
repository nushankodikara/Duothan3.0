import { prisma } from '$lib/server/prisma';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_ROLE_ID } from '$env/static/private';

export const GET = async ({ params }) => {
	try {
		const pharmacy = await prisma.pharmacy.findUnique({
			where: {
				id: params.id
			}
		});

		return new Response(JSON.stringify({ pharmacy }), {
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Not Found.' }), {
			status: 404
		});
	}
};

export const PUT = async ({ params, request }) => {
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

		try {
			const body = await request.formData();
			const email = body.get('email');
			const name = body.get('name');
			const address = body.get('address');
			const phone = body.get('phone');
			const lon = body.get('lon');
			const lat = body.get('lat');

			if (email) {
				const update = await prisma.primaryUser.update({
					where: {
						id: params.id
					},
					data: {
						email
					}
				});

				if (!update) {
					return new Response(JSON.stringify({ message: 'Not Found.' }), {
						status: 404
					});
				} else {
					return new Response(JSON.stringify({ message: 'Updated.' }), {
						status: 200
					});
				}
			}

			if (name) {
				const update = await prisma.pharmacy.update({
					where: {
						id: params.id
					},
					data: {
						name
					}
				});

				if (!update) {
					return new Response(JSON.stringify({ message: 'Not Found.' }), {
						status: 404
					});
				} else {
					return new Response(JSON.stringify({ message: 'Updated.' }), {
						status: 200
					});
				}
			}

			if (address) {
				const update = await prisma.pharmacy.update({
					where: {
						id: params.id
					},
					data: {
						address
					}
				});

				if (!update) {
					return new Response(JSON.stringify({ message: 'Not Found.' }), {
						status: 404
					});
				} else {
					return new Response(JSON.stringify({ message: 'Updated.' }), {
						status: 200
					});
				}
			}

			if (phone) {
				const update = await prisma.pharmacy.update({
					where: {
						id: params.id
					},
					data: {
						phone
					}
				});

				if (!update) {
					return new Response(JSON.stringify({ message: 'Not Found.' }), {
						status: 404
					});
				} else {
					return new Response(JSON.stringify({ message: 'Updated.' }), {
						status: 200
					});
				}
			}

			if (lon) {
				const update = await prisma.pharmacy.update({
					where: {
						id: params.id
					},
					data: {
						lon,
						lat
					}
				});

				if (!update) {
					return new Response(JSON.stringify({ message: 'Not Found.' }), {
						status: 404
					});
				} else {
					return new Response(JSON.stringify({ message: 'Updated.' }), {
						status: 200
					});
				}
			}
		} catch (error) {
			return new Response(JSON.stringify({ message: 'Not Found.' }), {
				status: 404
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};

export const DELETE = async ({ params, request }) => {
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

		if (user.roleId !== ADMIN_ROLE_ID) {
			return new Response(JSON.stringify({ message: 'Unauthorized.' }), {
				status: 401
			});
		}

		const pharmacy = await prisma.pharmacy.findUnique({
			where: {
				id: params.id
			}
		});

		if (!pharmacy) {
			return new Response(JSON.stringify({ message: 'Not Found.' }), {
				status: 404
			});
		}

		const deletePharmacy = await prisma.pharmacy.delete({
			where: {
				id: params.id
			}
		});

		if (!deletePharmacy) {
			return new Response(JSON.stringify({ message: 'Not Found.' }), {
				status: 404
			});
		}

		return new Response(JSON.stringify({ message: 'Deleted.' }), {
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
