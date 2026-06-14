interface WritingGuideModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function WritingGuideModal({ isOpen, onClose }: WritingGuideModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-5">
			<button
				type="button"
				className="absolute inset-0 bg-black/50 border-none cursor-default p-0"
				onClick={onClose}
				aria-label="모달 닫기"
			/>
			<div
				role="dialog"
				aria-label="작성 방법 안내"
				aria-modal="true"
				className="relative z-10 w-full max-w-[360px] rounded-3xl bg-white px-6 py-7 flex flex-col gap-6 shadow-xl"
			>
				<div className="flex items-center justify-between">
					<h2 className="text-[18px] font-semibold text-black m-0">작성 방법</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="닫기"
						className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer outline-none text-[#9CA3AF] text-[20px] leading-none p-0"
					>
						✕
					</button>
				</div>

				<div className="flex flex-col gap-2">
					<p className="m-0 text-[15px] font-semibold text-black">
						경험은 주관적인 생각 없이 <span className="text-[#0073FF]">사실만</span> 작성해주세요
					</p>
					<div className="rounded-2xl bg-[#F3F4F6] px-4 py-3">
						<p className="m-0 text-[13px] font-medium text-[#6B7280] leading-[1.7]">
							<span className="font-semibold text-[#374151]">예시</span>
							{"  "}매주 회의하기 전 주제를 먼저 공유해주고, 회의 분위기를 주도해주었다.
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<p className="m-0 text-[15px] font-semibold text-black">
						생각은 <span className="text-[#0073FF]">자세할수록</span> 좋아요
					</p>
					<div className="rounded-2xl bg-[#F3F4F6] px-4 py-3">
						<p className="m-0 text-[13px] font-medium text-[#6B7280] leading-[1.7]">
							<span className="font-semibold text-[#374151]">예시</span>
							{"  "}회의가 길어지면서 팀원들의 집중력이 떨어질 때, 적극적으로 분위기를 환기해주어서 매우 도움이 되었다. 특히 서로 의견이 엇갈리는 상황에서도 침착하게 중간 입장을 정리해주어 팀 전체가 합의점을 찾을 수 있었다. 덕분에 회의 시간이 단축되었고, 팀원 모두가 납득할 수 있는 결론을 낼 수 있었다.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
