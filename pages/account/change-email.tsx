import ButtonBase from "@components/common/base-button";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormSection from "@components/forms/form-section";
import Navigation from "@components/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { zUserLogin } from "@models/iUser";
import { iUserLogin } from "@models/iUser";
import { useForm } from "react-hook-form";
import { staticURLs } from "statics/url";

export default function ChangeEmail() {
	const { onRequestChangeEmail } = useAccount();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<iUserLogin>({
		resolver: zodResolver(zUserLogin),
	});

	return (
		<Form onSubmit={handleSubmit(onRequestChangeEmail)}>
			<Navigation label="" path={staticURLs.client.account.base} />
			<FormSection title="email change">
				<FormInput
					labelText="your new email"
					placeholder="please enter your new email"
					warnings={errors.email?.message}
					register={register("email", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>

				<FormInput
					labelText="password"
					placeholder="please enter your password"
					type="password"
					warnings={errors.password?.message}
					register={register("password", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>

				<ButtonBase>change</ButtonBase>
			</FormSection>
		</Form>
	);
}
