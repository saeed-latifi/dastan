import Account from "@components/account";

export default function HeaderMain() {
	return (
		<div className="grow-0 w-full flex items-center justify-center sticky z-10 top-0 bg-theme-shade text-theme-accent border-b border-theme-border">
			<div className="max-w-7xl flex flex-1 p-2 h-max items-center justify-evenly min-h-[3rem]">
				<Account />
			</div>
		</div>
	);
}
