/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import FormItemRow from "@components/forms/form-item-row";
import FormSection from "@components/forms/form-section";
import TextArea from "@components/forms/form-text-area";
import TeamLogo, { logoImageTypes } from "@components/images/team-logo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { useTeam } from "@hooks/panel/useTeam";
import { iTeamCreate, zTeamContact, zTeamCreate } from "@models/iTeam";
import DateFormatter from "@components/dateFormatter";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Navigation from "@components/navigation";

export default function ModifyTeam() {
	const { userInfo, checkAccessRedirect } = useAccount();
	checkAccessRedirect();

	const [contactMethod, setContactMethod] = useState<string>();
	const [contactMethods, setContactMethods] = useState<string[]>([]);
	const [team, setTeam] = useState<any>();
	const router = useRouter();

	const { onAddTeam, onUpdateTeam, teamsInfo, isLoading, allowMoreTeam, allowMoreJob } = useTeam();

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
			const item = teamsInfo?.find((item) => item.id === parseInt(router.query.item as string));
			setTeam(item);
			if (item?.contactMethods && Array.isArray(item.contactMethods)) setContactMethods(item.contactMethods);
		}
	}, [router, teamsInfo]);

	async function onSubmit(data: iTeamCreate) {
		if (team) {
			await onUpdateTeam({ ...data, id: team.id, contactMethods });
		} else {
			await onAddTeam({ ...data, userId: userInfo.id, contactMethods });
		}
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

	if (isLoading || !router.isReady) return <LoaderSpinner />;
	if (router.query.item && !team) {
		return (
			<div className="flex flex-col items-center gap-4">
				<p>bad address</p>
				<ButtonBase type="button" onClick={() => router.push("/team/")}>
					back to your teams list
				</ButtonBase>
			</div>
		);
	}

	if (!router.query.item && !allowMoreTeam()) {
		return (
			<div className="flex flex-col items-center gap-4">
				<p>You have reached your team limit</p>
				<ButtonBase type="button" onClick={() => router.push("/team/")}>
					back to your teams list
				</ButtonBase>
			</div>
		);
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Navigation label="" path="/team" />

			{team && (
				<FormSection title="team logo">
					<TeamLogo id={team.id} logoType={logoImageTypes.full} />
					<ButtonBase type="button" onClick={() => router.push(`/team/logo?item=${team.id}`)}>
						update your team logo
					</ButtonBase>
				</FormSection>
			)}
			<FormSection title="base info">
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
			</FormSection>
			<FormSection title="contact methods">
				<TextArea value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} />
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={onAddContactMethod}>
					add new contact method
				</ButtonBase>
				{contactMethods.map((title, index) => (
					<FormItemRow key={index} index={index} title={title} onClick={onRemoveContactMethod} />
				))}
			</FormSection>
			<FormSection title={team ? "update" : "create"}>
				<ButtonBase>{team ? "update info" : "create new team"}</ButtonBase>
			</FormSection>
			{team && (
				<FormSection title="jobs">
					{allowMoreJob(team.id) && (
						<ButtonBase type="button" onClick={() => router.push(`/job/${team.id}`)}>
							open a new job
						</ButtonBase>
					)}
					{Array.isArray(team.jobs) &&
						team.jobs.map((job: any, index: number) => (
							<div key={index} className="flex items-center justify-between gap-2 py-2">
								<Link href={`/job/${team.id}?item=${job.id}`}>{job.title}</Link>
								<DateFormatter date={job.updatedAt} />
							</div>
						))}
				</FormSection>
			)}
		</Form>
	);
}
