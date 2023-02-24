import { prisma } from '$lib/server/prisma';
import { SALT } from '$env/static/private';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET, ADMIN_ROLE_ID } from '$env/static/private';

export const GET = async ({ request, params }) => {
	try {
		const token = request.headers.get('Authorization').split(' ')[1];
		const { id } = params;
		try {
			const decode = verify(token, JWT_SECRET);
			if (id != decode.id) {
				return new Response(
					JSON.stringify({ message: 'You are not authorized to view this user.' }),
					{
						status: 401
					}
				);
			}

			const user = await prisma.primaryUser.findUnique({
				where: {
					id
				}
			});

			if (!user) {
				return new Response(JSON.stringify({ message: 'User does not exist.' }), { status: 404 });
			}

			return new Response(
				JSON.stringify({
					message: 'User found.',
					user: {
						id: user.id,
						email: user.email,
						username: user.username,
						role: user.roleId,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt
					}
				}),
				{ status: 200 }
			);
		} catch (error) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};

export const PUT = async ({ params, request }) => {
	try {
		const token = request.headers.get('Authorization').split(' ')[1];

		const { id } = params;
		const body = await request.formData();
		const email = body.get('email');
		const password = body.get('password');

		try {
			const decode = verify(token, JWT_SECRET);
			if (id != decode.id) {
				return new Response(
					JSON.stringify({ message: 'You are not authorized to update this user.' }),
					{
						status: 401
					}
				);
			}

			if (email) {
				try {
					await prisma.primaryUser.update({
						where: {
							id
						},
						data: {
							email
						}
					});

					return new Response(JSON.stringify({ message: 'Email updated successfully.' }), {
						status: 200
					});
				} catch (error) {
					return new Response(JSON.stringify({ message: 'Email cannot be updated.' }), {
						status: 500
					});
				}
			}

			if (password) {
				const passwordhash = await bcrypt.hash(password, Number(SALT));
				try {
					await prisma.primaryUser.update({
						where: {
							id
						},
						data: {
							passwordhash
						}
					});

					return new Response(JSON.stringify({ message: 'Password updated successfully.' }), {
						status: 200
					});
				} catch (error) {
					return new Response(JSON.stringify({ message: 'Password cannot be updated.' }), {
						status: 500
					});
				}
			}
		} catch (error) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
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

		try {
			const { id } = verify(token, JWT_SECRET);
			const pid = params.id;

			const user = await prisma.primaryUser.findUnique({
				where: {
					id
				}
			});

			if (!user) {
				return new Response(JSON.stringify({ message: 'User does not exist.' }), { status: 404 });
			}

			if (user.roleId != ADMIN_ROLE_ID) {
				return new Response(
					JSON.stringify({ message: 'You are not authorized to delete this user.' }),
					{
						status: 401
					}
				);
			}

			try {
				await prisma.primaryUser.delete({
					where: {
						id: pid
					}
				});

				return new Response(JSON.stringify({ message: 'User deleted successfully.' }), {
					status: 200
				});
			} catch (error) {
				return new Response(JSON.stringify({ message: 'User cannot be deleted.' }), {
					status: 500
				});
			}
		} catch (error) {
			return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
				status: 401
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Invalid Token.' }), {
			status: 401
		});
	}
};
