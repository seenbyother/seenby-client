type GenerationStatusValue = "PROCESSING" | "COMPLETED" | "FAILED";

export type GenerationRecoveryPhase =
	| "checking"
	| "waiting"
	| "resumed"
	| "paused"
	| "unavailable";

type GenerationStatusUpdate = {
	status: GenerationStatusValue;
};

type RecoveryEventHandlers<TUpdate extends GenerationStatusUpdate> = {
	onOpen: () => void;
	onStatus: (update: TUpdate) => boolean;
	onDeleted: () => void;
	onError: () => void;
};

type GenerationRecoveryOptions<TUpdate extends GenerationStatusUpdate> = {
	subscribe: (handlers: RecoveryEventHandlers<TUpdate>) => () => void;
	getStatus: () => Promise<TUpdate>;
	onStatus: (update: TUpdate) => boolean;
	onUnavailable: () => void;
	onPhaseChange: (phase: GenerationRecoveryPhase | undefined) => void;
	isNotFoundError: (error: unknown) => boolean;
};

type GenerationRecoveryController = {
	dispose: () => void;
};

const RETRY_DELAYS_MS = [1_000, 2_500, 5_000] as const;
const STABLE_CONNECTION_RESET_MS = 30_000;
const RECOVERY_RESUMED_NOTICE_MS = 1_200;

export function createGenerationRecoveryController<
	TUpdate extends GenerationStatusUpdate,
>({
	subscribe,
	getStatus,
	onStatus,
	onUnavailable,
	onPhaseChange,
	isNotFoundError,
}: GenerationRecoveryOptions<TUpdate>): GenerationRecoveryController {
	let isDisposed = false;
	let retryAttempt = 0;
	let requestVersion = 0;
	let isRecoveringFromError = false;
	let resumedUntil = 0;
	let closeSubscription: (() => void) | null = null;
	let retryTimer: ReturnType<typeof setTimeout> | null = null;
	let stableConnectionTimer: ReturnType<typeof setTimeout> | null = null;
	let resumedTimer: ReturnType<typeof setTimeout> | null = null;
	let pendingStatusTimer: ReturnType<typeof setTimeout> | null = null;

	const clearRetryTimer = () => {
		if (retryTimer === null) return;
		clearTimeout(retryTimer);
		retryTimer = null;
	};

	const clearStableConnectionTimer = () => {
		if (stableConnectionTimer === null) return;
		clearTimeout(stableConnectionTimer);
		stableConnectionTimer = null;
	};

	const clearResumedTimer = () => {
		if (resumedTimer === null) return;
		clearTimeout(resumedTimer);
		resumedTimer = null;
	};

	const clearPendingStatusTimer = () => {
		if (pendingStatusTimer === null) return;
		clearTimeout(pendingStatusTimer);
		pendingStatusTimer = null;
	};

	const closeCurrentSubscription = () => {
		closeSubscription?.();
		closeSubscription = null;
	};

	const markConnectionStableLater = () => {
		clearStableConnectionTimer();
		stableConnectionTimer = setTimeout(() => {
			retryAttempt = 0;
			stableConnectionTimer = null;
		}, STABLE_CONNECTION_RESET_MS);
	};

	const showResumedPhase = () => {
		if (!isRecoveringFromError) return;

		clearResumedTimer();
		resumedUntil = Date.now() + RECOVERY_RESUMED_NOTICE_MS;
		onPhaseChange("resumed");
		resumedTimer = setTimeout(() => {
			resumedTimer = null;
			resumedUntil = 0;
			isRecoveringFromError = false;
			onPhaseChange(undefined);
		}, RECOVERY_RESUMED_NOTICE_MS);
	};

	const applyStatus = (update: TUpdate) => {
		const didApply = onStatus(update);
		if (!didApply) return false;

		if (!(update.status === "PROCESSING" && resumedUntil > Date.now())) {
			onPhaseChange(undefined);
		}

		if (update.status !== "PROCESSING") {
			retryAttempt = 0;
			isRecoveringFromError = false;
			resumedUntil = 0;
			clearRetryTimer();
			clearStableConnectionTimer();
			clearResumedTimer();
			clearPendingStatusTimer();
			closeCurrentSubscription();
		}

		return true;
	};

	const finishWithStatus = (update: TUpdate) => {
		if (update.status === "PROCESSING") return applyStatus(update);
		if (update.status === "FAILED") return applyStatus(update);

		if (isRecoveringFromError && resumedUntil === 0) showResumedPhase();
		const remainingNoticeMs = resumedUntil - Date.now();
		if (remainingNoticeMs <= 0) return applyStatus(update);

		clearRetryTimer();
		clearStableConnectionTimer();
		closeCurrentSubscription();
		clearPendingStatusTimer();
		pendingStatusTimer = setTimeout(() => {
			pendingStatusTimer = null;
			if (isDisposed) return;
			applyStatus(update);
		}, remainingNoticeMs);
		return true;
	};

	const markUnavailable = () => {
		requestVersion += 1;
		clearRetryTimer();
		clearStableConnectionTimer();
		clearResumedTimer();
		clearPendingStatusTimer();
		isRecoveringFromError = false;
		resumedUntil = 0;
		closeCurrentSubscription();
		onUnavailable();
		onPhaseChange("unavailable");
	};

	let connect: () => void;
	let recover: () => Promise<void>;

	const scheduleRetry = (next: () => void) => {
		if (retryAttempt >= RETRY_DELAYS_MS.length) {
			onPhaseChange("paused");
			return;
		}

		const delay = RETRY_DELAYS_MS[retryAttempt];
		retryAttempt += 1;
		onPhaseChange("waiting");
		clearRetryTimer();
		retryTimer = setTimeout(() => {
			retryTimer = null;
			next();
		}, delay);
	};

	recover = async () => {
		if (isDisposed) return;

		isRecoveringFromError = true;
		resumedUntil = 0;
		closeCurrentSubscription();
		clearRetryTimer();
		clearStableConnectionTimer();
		clearResumedTimer();
		clearPendingStatusTimer();
		onPhaseChange("checking");
		const currentRequestVersion = ++requestVersion;

		try {
			const update = await getStatus();
			if (isDisposed || currentRequestVersion !== requestVersion) return;

			const didApply = finishWithStatus(update);
			if (didApply && update.status === "PROCESSING") {
				scheduleRetry(connect);
			}
		} catch (error) {
			if (isDisposed || currentRequestVersion !== requestVersion) return;

			if (isNotFoundError(error)) {
				markUnavailable();
				return;
			}

			scheduleRetry(() => {
				void recover();
			});
		}
	};

	connect = () => {
		if (isDisposed) return;

		clearRetryTimer();
		closeCurrentSubscription();

		try {
			closeSubscription = subscribe({
				onOpen: () => {
					if (isDisposed) return;
					if (isRecoveringFromError) showResumedPhase();
					else onPhaseChange(undefined);
					markConnectionStableLater();
				},
				onStatus: (update) => {
					if (isDisposed) return false;
					return finishWithStatus(update);
				},
				onDeleted: () => {
					if (isDisposed) return;
					markUnavailable();
				},
				onError: () => {
					if (isDisposed) return;
					void recover();
				},
			});
		} catch {
			void recover();
		}
	};

	connect();

	return {
		dispose: () => {
			if (isDisposed) return;
			isDisposed = true;
			requestVersion += 1;
			clearRetryTimer();
			clearStableConnectionTimer();
			clearResumedTimer();
			clearPendingStatusTimer();
			closeCurrentSubscription();
		},
	};
}
