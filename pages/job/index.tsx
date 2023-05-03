import FormInput from "@components/forms/form-input";
import Form from "@components/forms/form";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import { FormEvent, useState } from "react";
import FormSection from "@components/forms/form-section";
import Select from "@components/common/select";
import { useProvince } from "@hooks/useProvince";
import { selectOptionType } from "@components/common/select-multi";
import { iProvince } from "@models/iProvince";
import { WageType } from "@prisma/client";
import TextArea from "@components/forms/form-text-area";
import FormItemRow from "@components/forms/form-item-row";
import FormRadio from "@components/forms/form-radio";
import FormToggle from "@components/forms/form-toggle";

{
	//         keywords;
}

export default function Jobs() {
	const { provinces } = useProvince();
	const [requirement, setRequirement] = useState("");
	const [benefit, setBenefit] = useState("");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [requirements, setRequirements] = useState<string[]>([]);
	const [benefits, setBenefits] = useState<string[]>([]);
	const [wageType, setWageType] = useState<WageType>("FIXED");
	const [wage, setWage] = useState(0);
	const [selectedProvince, setSelectedProvince] = useState<iProvince>();
	const [showPhone, setShowPhone] = useState(true);
	const [showEmail, setShowEmail] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const body = { title, description, wage, requirements, benefits, wageType, selectedProvince, showPhone, showEmail };
		console.log("body ", body);
	};

	const onSelectProvince = (option: selectOptionType) => {
		setSelectedProvince({ id: option.value, title: option.label });
	};

	const addRequirement = () => {
		if (requirement) {
			setRequirements([...requirements, requirement]);
			setRequirement("");
		}
	};

	const removeRequirement = (index: number) => {
		const newArr = requirements.filter((_, i) => index !== i);
		setRequirements(newArr);
	};

	const addBenefits = () => {
		if (benefit) {
			setBenefits([...benefits, benefit]);
			setBenefit("");
		}
	};

	const removeBenefits = (index: number) => {
		const newArr = benefits.filter((_, i) => index !== i);
		setBenefits(newArr);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<FormSection title="title">
				<FormInput value={title} onChange={(e) => setTitle(e.target.value)} />
			</FormSection>

			<FormSection title="description">
				<TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
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
					options={provinces?.map((province) => ({ value: province.id, label: province.title }))}
					onChange={onSelectProvince}
				/>
			</FormSection>

			<FormSection title="wage">
				<div className="flex w-full items-center justify-around text-gray-600">
					<FormRadio label="FIXED" value={WageType.FIXED} onChange={setWageType} selected={wageType} />
					<FormRadio label="AGREEMENT" value={WageType.AGREEMENT} onChange={setWageType} selected={wageType} />
					<FormRadio label="PARTNERSHIP" value={WageType.PARTNERSHIP} onChange={setWageType} selected={wageType} />
				</div>
				{wageType === WageType.FIXED && (
					<FormInput type="number" value={wage} onChange={(e) => setWage(parseInt(e.target.value))}></FormInput>
				)}
			</FormSection>

			<FormSection title="contact">
				<FormToggle title="showPhone" preChecked={showPhone} onChange={setShowPhone} />
				<FormToggle title="showEmail" preChecked={showEmail} onChange={setShowEmail} />
			</FormSection>

			<ButtonBase Variety={BaseButtonVariety.form} type="submit">
				add job
			</ButtonBase>
		</Form>
	);
}

// const upsertUser = await prisma.user.upsert({
// 	where: { id: id || 0 },
// 	update: {},
// 	create: {
// 		name: "Name",
// 	},
// });
