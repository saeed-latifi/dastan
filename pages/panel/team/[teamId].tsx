import FormInput from "@components/forms/form-input";
import Form from "@components/forms/form";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import { FormEvent, useEffect, useState } from "react";
import FormSection from "@components/forms/form-section";
import Select from "@components/common/select";
import { useProvince } from "@hooks/public/useProvince";
import { selectOptionType } from "@components/common/select-multi";
import { iProvince } from "@models/iProvince";
import { WageType } from "@prisma/client";
import TextArea from "@components/forms/form-text-area";
import FormItemRow from "@components/forms/form-item-row";
import FormRadio from "@components/forms/form-radio";
import { zJobTerm, zJobCreate, zRequirements, zBenefits } from "@models/iJob";
import { toast } from "react-toastify";
import { errorType, zodErrorMapper } from "@providers/apiResponseHandler";
import { emptyPurger } from "@utilities/nullPurger";
import { useRouter } from "next/router";
import { useTeamPanel } from "@hooks/panel/useTeamPanel";
import LoadingSpinner from "@components/animations/LoadingAnimation";
import Navigation from "@components/navigation";
import { staticURLs } from "statics/url";
import { jobPanelResType } from "@providers/prismaProviders/jobPrisma";
import { useCategory } from "@hooks/public/useCategory";
import { iCategory } from "@models/iCategory";

export default function Jobs() {
	const router = useRouter();
	const { provinces } = useProvince();
	const { onAddJob, teamsInfo, isLoading, allowMoreJob, onUpdateJob } = useTeamPanel();
	const [job, setJob] = useState<jobPanelResType>();

	const [requirement, setRequirement] = useState<string>();
	const [benefit, setBenefit] = useState<string>();

	const [title, setTitle] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [requirements, setRequirements] = useState<string[]>([]);
	const [benefits, setBenefits] = useState<string[]>([]);
	const [wageType, setWageType] = useState<WageType>("FIXED");
	const [wage, setWage] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState<iCategory>();
	const [selectedProvince, setSelectedProvince] = useState<iProvince>({ id: -1, title: "remote" });

	const [errors, setErrors] = useState<errorType>();

	const { categories } = useCategory();

	useEffect(() => {
		if (router.isReady) {
			const team = teamsInfo?.find((item) => item.id === parseInt(router.query.teamId as string));
			if (team) {
				const item = team.jobs?.find((item: any) => item.id === parseInt(router.query.item as string));
				if (item) {
					setJob(item);
					setTitle(item.title);
					setDescription(item.description);
					setRequirements(item.requirements);
					setBenefits(item.benefits);
					setWageType(item.wageType);
					setWage(item.wage || 0);
					setSelectedCategory(item.category);
					item.province && setSelectedProvince(item.province);
				}
			}
		}
	}, [router, teamsInfo]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		function provinceHandler() {
			if (selectedProvince) {
				if (selectedProvince.id > 0) return selectedProvince.id;
				return null;
			}
			return undefined;
		}

		event.preventDefault();
		if (!selectedCategory) return toast.warn("select a category");

		if (router.query.teamId) {
			const body = {
				title,
				description,
				wageType,
				requirements,
				benefits,
				wage,
				categoryId: selectedCategory.id,
				teamId: parseInt(router.query.teamId as string),
			};

			const purged = emptyPurger(body);
			const validJob = zJobCreate.safeParse(purged);
			if (validJob.success) {
				setErrors({});
				validJob.data.provinceId = provinceHandler();
				if (job) await onUpdateJob({ ...validJob.data, id: parseInt(router.query.item as string) });
				else await onAddJob(validJob.data);
			} else setErrors(zodErrorMapper(validJob.error.issues));
		}
	}

	const onSelectProvince = (option: selectOptionType) => {
		setSelectedProvince({ id: option.value, title: option.label });
	};

	const addRequirement = () => {
		if (requirement) {
			const term = zJobTerm.safeParse(requirement);
			if (!term.success) return toast.warn(term.error.issues[0].message);
			const newArr = [...requirements, requirement];
			const validate = zRequirements.safeParse(newArr);
			if (!validate.success) return toast.warn(validate.error.issues[0].message);
			setRequirements(newArr);
			setRequirement("");
		}
	};

	const removeRequirement = (index: number) => {
		const newArr = requirements.filter((_, i) => index !== i);
		setRequirements(newArr);
	};

	const addBenefits = () => {
		if (benefit) {
			const term = zJobTerm.safeParse(benefit);
			if (!term.success) return toast.warn(term.error.issues[0].message);
			const newArr = [...benefits, benefit];
			const validate = zBenefits.safeParse(newArr);
			if (!validate.success) return toast.warn(validate.error.issues[0].message);
			setBenefits(newArr);
			setBenefit("");
		}
	};

	const removeBenefits = (index: number) => {
		const newArr = benefits.filter((_, i) => index !== i);
		setBenefits(newArr);
	};

	function onSelectCategory(option: selectOptionType) {
		setSelectedCategory({ id: option.value, title: option.label });
	}

	function provinceMapper() {
		const options = [{ value: 0, label: "remote" }];
		if (provinces) {
			provinces.forEach((p) => {
				options.push({ label: p.title, value: p.id });
			});
		}
		return options;
	}

	if (isLoading || !router.isReady) return <LoadingSpinner />;
	if (router.query.item && !job) {
		return (
			<div className="flex flex-col items-center gap-4">
				<p>bad address</p>
				<ButtonBase type="button" onClick={() => router.push(staticURLs.client.panel.team.all)}>
					back to your teams list
				</ButtonBase>
			</div>
		);
	}

	if (!router.query.item && !allowMoreJob(parseInt(router.query.teamId as string))) {
		return (
			<div className="flex flex-col items-center gap-4">
				<p>You have reached your jobs limit</p>
				<ButtonBase type="button" onClick={() => router.push(staticURLs.client.panel.team.all)}>
					back to your teams list
				</ButtonBase>
			</div>
		);
	}
	return (
		<Form onSubmit={handleSubmit}>
			<Navigation label="" path={staticURLs.client.panel.team.one({ teamId: parseInt(router.query.teamId as string) })} />
			<FormSection title="title">
				<FormInput value={title} onChange={(e) => setTitle(e.target.value)} warnings={errors?.title} />
			</FormSection>
			<FormSection title="description">
				<TextArea value={description} onChange={(e) => setDescription(e.target.value)} warnings={errors?.description} />
			</FormSection>

			<FormSection title="category">
				<Select
					selectId="profileProvinces"
					preSelect={job?.category && { label: job.category.title, value: job.category.id }}
					options={categories?.map((category) => ({ value: category.id, label: category.title }))}
					onChange={onSelectCategory}
				/>
			</FormSection>

			<FormSection title="requirements">
				<TextArea value={requirement} onChange={(e) => setRequirement(e.target.value)} />
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={addRequirement}>
					add new requirement
				</ButtonBase>
				{requirements.map((title, index) => (
					<FormItemRow key={index} index={index} title={title} onClick={removeRequirement} />
				))}
			</FormSection>
			<FormSection title="benefits">
				<TextArea value={benefit} onChange={(e) => setBenefit(e.target.value)} />
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={addBenefits}>
					add new benefits
				</ButtonBase>
				{benefits.map((title, index) => (
					<FormItemRow key={index} index={index} title={title} onClick={removeBenefits} />
				))}
			</FormSection>
			<FormSection title="location">
				<Select
					selectId="profileProvinces"
					options={provinceMapper()}
					preSelect={{ label: selectedProvince?.title as string, value: selectedProvince?.id as number }}
					onChange={onSelectProvince}
				/>
			</FormSection>
			<FormSection title="wage">
				<div className="flex w-full items-center justify-around text-gray-600">
					<FormRadio label="FIXED" value={WageType.FIXED} onChange={setWageType} selected={wageType} />
					<FormRadio label="AGREEMENT" value={WageType.AGREEMENT} onChange={setWageType} selected={wageType} />
					<FormRadio label="PARTNERSHIP" value={WageType.PARTNERSHIP} onChange={setWageType} selected={wageType} />
				</div>
				{wageType === WageType.FIXED && <FormInput type="number" value={wage} onChange={(e) => setWage(parseInt(e.target.value))}></FormInput>}
			</FormSection>

			<ButtonBase Variety={BaseButtonVariety.form} type="submit">
				{job ? "update" : "create"}
			</ButtonBase>
		</Form>
	);
}
