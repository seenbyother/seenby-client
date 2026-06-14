import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { exchangeKakaoLoginCode } from "@/features/auth/api";
import { getPostLoginRedirectPath } from "@/features/onboarding/storage";
import { ApiError } from "@/shared/api";
import "./AuthCallbackPage.css";

type CallbackStatus = "loading" | "error";

function getErrorMessage(error: unknown) {
	if (error instanceof ApiError) {
		const body = error.body as { message?: unknown };

		if (typeof body?.message === "string") {
			return body.message;
		}
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "로그인 처리 중 문제가 발생했습니다.";
}

export function AuthCallbackPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState<CallbackStatus>("loading");
	const [message, setMessage] = useState(
		"카카오 로그인 정보를 확인하고 있어요.",
	);
	const tokenExchangeMutation = useMutation({
		mutationFn: exchangeKakaoLoginCode,
		onSuccess: () => {
			navigate(getPostLoginRedirectPath(), { replace: true });
		},
		onError: (error: unknown) => {
			setStatus("error");
			setMessage(getErrorMessage(error));
		},
	});

	useEffect(() => {
		const code = searchParams.get("code");

		if (!code) {
			setStatus("error");
			setMessage("로그인 코드가 없습니다. 다시 로그인해 주세요.");
			return;
		}

		tokenExchangeMutation.mutate(code);
	}, [searchParams, tokenExchangeMutation.mutate]);

	return (
		<main className="auth-callback-page">
			<section className="auth-callback-screen" aria-live="polite">
				{status === "loading" ? (
					<div className="auth-callback-status" aria-hidden="true" />
				) : null}
				<h1>{status === "loading" ? "로그인 중" : "로그인 실패"}</h1>
				<p>{message}</p>
				{status === "error" ? (
					<Link className="auth-callback-action" to="/login">
						로그인으로 돌아가기
					</Link>
				) : null}
			</section>
		</main>
	);
}
