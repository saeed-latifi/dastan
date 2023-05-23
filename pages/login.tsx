import { useAccount } from "@hooks/useAccount";
import { zUserLogin, iUserLogin } from "@models/iUser";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/forms/form-input";
import Form from "@components/forms/form";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";

export default function Login() {
	const { onLogin, warnings } = useAccount();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<iUserLogin>({ resolver: zodResolver(zUserLogin) });

	return (
		<div className="flex flex-col gap-4 p-2 items-center">
			<Form onSubmit={handleSubmit(onLogin)}>
				<FormInput labelText="email" type="email" warnings={errors.email?.message} register={register("email")} required />

				<FormInput
					type="password"
					labelText="password"
					warnings={errors.password?.message}
					register={register("password")}
					required
				/>

				<ButtonBase Variety={BaseButtonVariety.form} type="submit">
					log in
				</ButtonBase>
			</Form>

			<Link className="link bold" href="/sign_up">
				<p>create your account</p>
			</Link>
			<Link className="link bold" href="/recover-password">
				<p>forget your password</p>
			</Link>
			<Link className="link bold" href="/resend-activation">
				<p>resend Activation email</p>
			</Link>
		</div>
	);
}
