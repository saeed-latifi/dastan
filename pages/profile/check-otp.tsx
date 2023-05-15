import ButtonBase from "@components/common/base-button";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormSection from "@components/forms/form-section";
import { useAccount } from "@hooks/useAccount";
import Link from "next/link";
import { useState } from "react";

export default function CheckOtp() {
	const { onCheckOTP } = useAccount();
	const [otp, setOtp] = useState("");

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				onCheckOTP(otp);
			}}
		>
			<FormSection title="phone confirm ">
				<FormInput value={otp} onChange={(e) => setOtp(e.target.value)} labelText="otp code" required />

				<ButtonBase>submit</ButtonBase>

				<ButtonBase type="button">
					<Link href="/profile/add-phone">change number</Link>
				</ButtonBase>
			</FormSection>
		</Form>
	);
}
