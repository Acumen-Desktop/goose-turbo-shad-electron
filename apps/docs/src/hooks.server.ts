import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		return await resolve(event);
	} catch (error) {
		const errorId = crypto.randomUUID();
		console.error('Unhandled error in request:', {
			errorId,
			url: event.url.toString(),
			method: event.request.method,
			error:
				error instanceof Error
					? {
							message: error.message,
							stack: error.stack,
							cause: error.cause
						}
					: error
		});

		// Return a user-friendly error response
		return new Response(
			JSON.stringify({
				error: 'Internal Server Error',
				errorId
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('Server error:', {
		url: event.url.toString(),
		method: event.request.method,
		error:
			error instanceof Error
				? {
						message: error.message,
						stack: error.stack,
						cause: error.cause
					}
				: error
	});

	return {
		message: 'An unexpected error occurred',
		code: 'INTERNAL_ERROR'
	};
};
