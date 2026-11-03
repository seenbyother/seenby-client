export const EMAIL_MAX_LENGTH = 254;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailFormatValid(email: string) {
	return (
		email.length > 0 &&
		email.length <= EMAIL_MAX_LENGTH &&
		EMAIL_PATTERN.test(email)
	);
}
