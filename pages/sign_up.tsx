import { iUserCreate, zUserCreate } from "@models/iUser";
import { useAccount } from "@hooks/useAccount";
import FormInput from "@components/forms/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "@components/forms/form";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import FormSection from "@components/forms/form-section";

export default function SignUp() {
	const { onRegister, error, onErrorPurge } = useAccount();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<iUserCreate>({
		resolver: zodResolver(zUserCreate),
	});

	return (
		<Form onSubmit={handleSubmit((data) => onRegister(data))}>
			<FormSection title="create account">
				<FormInput
					labelText="firstName"
					warnings={errors.firstName?.message}
					register={register("firstName", { setValueAs: (v) => (v === "" ? undefined : v) })}
				/>

				<FormInput
					labelText="lastName"
					warnings={errors.lastName?.message}
					register={register("lastName", { setValueAs: (v) => (v === "" ? undefined : v) })}
				/>

				<FormInput
					labelText="username"
					warnings={errors.username?.message || error?.username}
					register={register("username", {
						setValueAs: (v) => (v === "" ? undefined : v),
						onChange: () => onErrorPurge("username"),
					})}
					required
				/>

				<FormInput
					labelText="email"
					warnings={errors.email?.message || error?.email}
					register={register("email", {
						setValueAs: (v) => (v === "" ? undefined : v),
						onChange: () => onErrorPurge("email"),
					})}
					required
				/>

				<FormInput
					labelText="password"
					type="password"
					warnings={errors.password?.message}
					register={register("password", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>
				<FormInput
					labelText="confirm password"
					type="password"
					warnings={errors.confirm?.message}
					register={register("confirm", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>
				<ButtonBase Variety={BaseButtonVariety.form} type="submit">
					register
				</ButtonBase>
			</FormSection>
		</Form>
	);
}
