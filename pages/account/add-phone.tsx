import ButtonBase from "@components/common/base-button";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormSection from "@components/forms/form-section";
import Navigation from "@components/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { iPhone, zPhone } from "@models/iUser";
import { useForm } from "react-hook-form";
import { staticURLs } from "statics/url";

export default function AddPhone() {
	const { onSendOTP } = useAccount();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<iPhone>({
		resolver: zodResolver(zPhone),
	});

	return (
		<Form onSubmit={handleSubmit(onSendOTP)}>
			<Navigation label="" path={staticURLs.client.profile.base} />

			<FormSection title="add phone">
				<FormInput
					labelText="your phone number"
					warnings={errors.phone?.message}
					register={register("phone", { setValueAs: (v) => (v === "" ? undefined : v) })}
					required
				/>

				<ButtonBase> add phone number</ButtonBase>
			</FormSection>
		</Form>
	);
}
