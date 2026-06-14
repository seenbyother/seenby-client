import { useQuery } from "@tanstack/react-query";
import { type CurrentUser, getCurrentUser } from "@/features/auth/api";

export const currentUserQueryKey = ["auth", "me"] as const;

export function useCurrentUser() {
	return useQuery({
		queryKey: currentUserQueryKey,
		queryFn: getCurrentUser,
		retry: false,
	});
}

export function getCurrentUserName(user?: CurrentUser | null) {
	return user?.nickname?.trim() || "사용자";
}
