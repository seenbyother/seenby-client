import { useEffect, useReducer, useState } from "react";
import { getNotificationSettingsErrorMessage } from "@/features/notification-settings/errors";
import {
	useRequestNotificationEmailVerification,
	useVerifyNotificationEmail,
} from "@/features/notification-settings/hooks";
import { isEmailFormatValid } from "@/features/notification-settings/validation";

type VerificationState =
	| { status: "idle" }
	| {
			status: "pending";
			email: string;
			requestId: string;
			expiresAt: string;
			canResendAt: number;
	  };

type VerificationAction =
	| {
			type: "requested";
			email: string;
			requestId: string;
			expiresAt: string;
			resendAfterSeconds: number;
	  }
	| { type: "reset" };

function verificationReducer(
	_state: VerificationState,
	action: VerificationAction,
): VerificationState {
	if (action.type === "reset") {
		return { status: "idle" };
	}

	return {
		status: "pending",
		email: action.email,
		requestId: action.requestId,
		expiresAt: action.expiresAt,
		canResendAt: Date.now() + action.resendAfterSeconds * 1000,
	};
}

interface UseEmailVerificationFlowParams {
	notificationEmail: string | null;
}

export function useEmailVerificationFlow({
	notificationEmail,
}: UseEmailVerificationFlowParams) {
	const [emailInput, setEmailInput] = useState(notificationEmail ?? "");
	const [isEditingEmail, setIsEditingEmail] = useState(
		notificationEmail === null,
	);
	const [code, setCode] = useState("");
	const [verification, dispatch] = useReducer(verificationReducer, {
		status: "idle",
	});
	const [, forceTick] = useReducer((tick: number) => tick + 1, 0);
	const requestVerificationMutation = useRequestNotificationEmailVerification();
	const verifyMutation = useVerifyNotificationEmail();

	useEffect(() => {
		if (verification.status === "idle") {
			setEmailInput(notificationEmail ?? "");
		}
	}, [notificationEmail, verification.status]);

	useEffect(() => {
		if (verification.status !== "pending") {
			return;
		}

		const interval = setInterval(forceTick, 1000);

		return () => clearInterval(interval);
	}, [verification.status]);

	const onEmailInputChange = (value: string) => {
		setEmailInput(value);

		if (verification.status === "pending" && value !== verification.email) {
			dispatch({ type: "reset" });
			setCode("");
		}
	};

	const onRequestCode = () => {
		const email = emailInput.trim();

		if (!isEmailFormatValid(email)) {
			return;
		}

		requestVerificationMutation.mutate(email, {
			onSuccess: (data) => {
				dispatch({
					type: "requested",
					email,
					requestId: data.requestId,
					expiresAt: data.expiresAt,
					resendAfterSeconds: data.resendAfterSeconds,
				});
				setCode("");
			},
		});
	};

	const onVerifyCode = () => {
		if (verification.status !== "pending") {
			return;
		}

		verifyMutation.mutate(
			{ requestId: verification.requestId, code },
			{
				onSuccess: () => {
					dispatch({ type: "reset" });
					setCode("");
					setIsEditingEmail(false);
				},
			},
		);
	};

	const onStartEditing = () => setIsEditingEmail(true);

	const onCancelEditing = () => {
		setIsEditingEmail(false);
		setEmailInput(notificationEmail ?? "");
	};

	const onCodeChange = (value: string) => {
		setCode(value.replace(/\D/g, "").slice(0, 6));
	};

	const remainingSeconds =
		verification.status === "pending"
			? Math.max(
					0,
					Math.round(
						(new Date(verification.expiresAt).getTime() - Date.now()) / 1000,
					),
				)
			: 0;
	const isExpired = verification.status === "pending" && remainingSeconds <= 0;
	const canResend =
		verification.status === "pending" && Date.now() >= verification.canResendAt;
	const trimmedEmailInput = emailInput.trim();
	const showEmailFormatError =
		trimmedEmailInput.length > 0 && !isEmailFormatValid(trimmedEmailInput);

	return {
		emailInput,
		code,
		verificationStatus: verification.status,
		showEmailInput: isEditingEmail || verification.status === "pending",
		showEmailFormatError,
		canCancelEditing:
			notificationEmail !== null && verification.status === "idle",
		requestLabel:
			verification.status === "pending" ? "재발송" : "인증번호 발송",
		requestDisabled:
			requestVerificationMutation.isPending ||
			!isEmailFormatValid(trimmedEmailInput) ||
			(verification.status === "pending" && !canResend),
		requestErrorMessage: requestVerificationMutation.isError
			? getNotificationSettingsErrorMessage(
					requestVerificationMutation.error,
					"인증번호 발송에 실패했어요.",
				)
			: undefined,
		verifyDisabled:
			verification.status !== "pending" ||
			verifyMutation.isPending ||
			code.length !== 6 ||
			isExpired,
		verifyErrorMessage: verifyMutation.isError
			? getNotificationSettingsErrorMessage(
					verifyMutation.error,
					"인증번호 확인에 실패했어요.",
				)
			: undefined,
		remainingSeconds,
		isExpired,
		onEmailInputChange,
		onCodeChange,
		onRequestCode,
		onVerifyCode,
		onStartEditing,
		onCancelEditing,
	};
}
