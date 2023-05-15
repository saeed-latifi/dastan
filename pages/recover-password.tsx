import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormSection from "@components/forms/form-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { zUserEmail, iUserEmail } from "@models/iUser";
import React from "react";
import { useForm } from "react-hook-form";

export default function RecoverPassword() {
	const { onRecoverPasswordRequest } = useAccount();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<iUserEmail>({ resolver: zodResolver(zUserEmail) });

	return (
		<Form onSubmit={handleSubmit(onRecoverPasswordRequest)}>
			<FormSection title="recover password">
				<FormInput labelText="email" warnings={errors.email?.message} register={register("email")} required />

				<ButtonBase Variety={BaseButtonVariety.form} type="submit">
					reset your password!
				</ButtonBase>
			</FormSection>
		</Form>
	);
}
