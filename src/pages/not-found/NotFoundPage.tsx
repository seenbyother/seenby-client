import { Link, useNavigate } from "react-router";
import forbiddenIcon from "@/assets/icons/ic_forbidden.svg";

export function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<main className="min-h-screen bg-white text-black">
			<section className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col px-5 pt-8 pb-8">
				<div className="flex flex-1 flex-col items-center justify-center text-center">
					<img
						src={forbiddenIcon}
						alt=""
						aria-hidden="true"
						className="mb-7 h-[154px] w-[137px] object-contain"
					/>

					<p className="m-0 text-[14px] font-bold leading-none text-[#0073FF]">
						404 Not Found
					</p>
					<h1 className="mt-4 mb-0 text-[28px] font-bold leading-[135%] text-black">
						페이지를 찾을 수 없어요
					</h1>
					<p className="mt-3 mb-0 max-w-[290px] text-[16px] font-medium leading-[150%] text-[#71717A]">
						주소가 변경되었거나 존재하지 않는 페이지예요. 주소를 다시
						확인해주세요.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Link
						to="/"
						className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#0073FF] text-[17px] font-semibold leading-none text-white no-underline"
					>
						홈으로 가기
					</Link>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="flex h-14 w-full items-center justify-center rounded-2xl border-0 bg-[#E5E7EB] text-[17px] font-medium leading-none text-[#111827]"
					>
						이전으로 돌아가기
					</button>
				</div>
			</section>
		</main>
	);
}
