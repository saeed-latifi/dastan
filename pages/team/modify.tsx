/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormItemRow from "@components/forms/form-item-row";
import FormSection from "@components/forms/form-section";
import TextArea from "@components/forms/form-text-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { useTeam } from "@hooks/useTeam";
import { iTeamCreate, zTeamContact, zTeamCreate } from "@models/iTeam";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ModifyTeam() {
	const [contactMethod, setContactMethod] = useState<string>();
	const [contactMethods, setContactMethods] = useState<string[]>([]);
	const [team, setTeam] = useState<any>();
	const router = useRouter();

	const { userInfo, checkAccessRedirect } = useAccount();
	checkAccessRedirect();

	const { onAddTeam, teamsInfo } = useTeam();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<iTeamCreate>({
		resolver: zodResolver(zTeamCreate),
		values: team,
	});

	useEffect(() => {
		if (router.isReady) {
			const item = teamsInfo?.filter((item) => item.id === parseInt(router.query.item as string))[0];
			setTeam(item);
			if (item?.contactMethods && Array.isArray(item.contactMethods)) setContactMethods(item.contactMethods);
		}
	}, [router, teamsInfo]);

	async function onSubmit(data: iTeamCreate) {
		const res = await onAddTeam({ ...data, userId: userInfo.id, contactMethods });
		console.log(res);
	}

	const onAddContactMethod = () => {
		if (contactMethod) {
			const valid = zTeamContact.safeParse(contactMethod);
			if (!valid.success) return toast.warn(valid.error.issues[0].message);
			setContactMethods([...contactMethods, contactMethod]);
			setContactMethod("");
		}
	};

	const onRemoveContactMethod = (index: number) => {
		const newArr = contactMethods.filter((_, i) => index !== i);
		setContactMethods(newArr);
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormInput
				labelText="title"
				warnings={errors.title?.message}
				register={register("title", { setValueAs: (v) => (v === "" ? undefined : v) })}
				required
			/>
			<TextArea
				labelText="description"
				warnings={errors.description?.message}
				register={register("description", { setValueAs: (v) => (v === "" ? undefined : v) })}
				required
			/>
			<FormSection title="contact methods">
				<TextArea value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} />
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={onAddContactMethod}>
					add new contact method
				</ButtonBase>
				{contactMethods.map((title, index) => (
					<FormItemRow key={index} index={index} title={title} onClick={onRemoveContactMethod} />
				))}
			</FormSection>

			<ButtonBase>create your team</ButtonBase>
		</Form>
	);
}
