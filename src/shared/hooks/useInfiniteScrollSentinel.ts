import { useEffect, useRef } from "react";

type UseInfiniteScrollSentinelOptions = {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	onLoadMore: () => void;
};

export function useInfiniteScrollSentinel({
	hasNextPage,
	isFetchingNextPage,
	onLoadMore,
}: UseInfiniteScrollSentinelOptions) {
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (!sentinel || !hasNextPage || isFetchingNextPage) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					onLoadMore();
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(sentinel);

		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, onLoadMore]);

	return sentinelRef;
}
