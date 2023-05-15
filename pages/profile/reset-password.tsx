import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormSection from "@components/forms/form-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { zResetPassword, iResetPassword } from "@models/iUser";
import { useForm } from "react-hook-form";

export default function RecoverPassword() {
	const { onResetPassword } = useAccount();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<iResetPassword>({ resolver: zodResolver(zResetPassword) });

	return (
		<Form onSubmit={handleSubmit(onResetPassword)}>
			<FormSection title="recover password">
				<FormInput
					labelText="password"
					type="password"
					warnings={errors.password?.message}
					register={register("password")}
					required
				/>
				<FormInput
					labelText="confirm"
					type="password"
					warnings={errors.confirm?.message}
					register={register("confirm")}
					required
				/>

				<ButtonBase Variety={BaseButtonVariety.form} type="submit">
					submit your new password
				</ButtonBase>
			</FormSection>
		</Form>
	);
}
