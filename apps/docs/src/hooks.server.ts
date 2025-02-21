import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    try {
        return await resolve(event);
    } catch (error) {
        console.error('Unhandled error in request:', {
            url: event.url.toString(),
            method: event.request.method,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                cause: error.cause
            } : error
        });
        throw error; // Re-throw to let SvelteKit handle the error response
    }
};

export const handleError: HandleServerError = ({ error, event }) => {
    console.error('Server error:', {
        url: event.url.toString(),
        method: event.request.method,
        error: error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        } : error
    });

    return {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR'
    };
}; 