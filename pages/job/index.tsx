import FormInput from "@components/forms/form-input";
import Form from "@components/forms/form";
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import { iJobCreate, zJobCreate } from "@models/iJob";
import { FormEvent, useRef, useState } from "react";
import FormSection from "@components/forms/form-section";
import Select from "@components/common/select";
import { useProvince } from "@hooks/useProvince";
import { selectOptionType } from "@components/common/select-multi";
import { iProvince } from "@models/iProvince";

{
	//   jobType,   showEmail, showPhone,   keywords;
}

export default function Jobs() {
	const { provinces } = useProvince();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [wage, setWage] = useState("");
	const [requirements, setRequirements] = useState<string[]>([]);
	const [benefits, setBenefits] = useState<string[]>([]);

	const requirementsRef = useRef<HTMLTextAreaElement>(null);
	const benefitsRef = useRef<HTMLTextAreaElement>(null);

	const [selectedProvince, setSelectedProvince] = useState<iProvince>();

	function onSelectProvince(option: selectOptionType) {
		setSelectedProvince({ id: option.value, title: option.label });
	}

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	const addRequirement = () => {
		if (requirementsRef.current) {
			const newItem = requirementsRef.current.value;
			setRequirements([...requirements, newItem]);
			requirementsRef.current.value = "";
		}
	};
	const removeRequirement = (index: number) => {
		const newArr = requirements.filter((_, i) => index !== i);
		setRequirements(newArr);
	};

	const addBenefits = () => {
		if (benefitsRef.current) {
			const newItem = benefitsRef.current.value;
			setBenefits([...benefits, newItem]);
			benefitsRef.current.value = "";
		}
	};
	const removeBenefits = (index: number) => {
		const newArr = benefits.filter((_, i) => index !== i);
		setBenefits(newArr);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<FormInput labelText="title" value={title} onChange={(e) => setTitle(e.target.value)}></FormInput>
			<FormInput labelText="description" value={description} onChange={(e) => setDescription(e.target.value)}></FormInput>
			<FormInput labelText="wage" type="number" value={wage} onChange={(e) => setWage(e.target.value)}></FormInput>

			<FormSection title="requirements">
				<textarea
					ref={requirementsRef}
					className="border-theme-border focus:border-theme-select focus:shadow-theme-dark rounded-theme-border outline-none border px-2 py-1  min-w-0 w-full min-h-input"
				/>
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={addRequirement}>
					add new requirement
				</ButtonBase>
				{requirements.map((requirement, index) => (
					<div key={index} className="w-full flex items-center justify-between">
						<span>{requirement}</span>
						<span onClick={() => removeRequirement(index)}>x</span>
					</div>
				))}
			</FormSection>

			<FormSection title="benefits">
				<textarea
					ref={benefitsRef}
					className="border-theme-border focus:border-theme-select focus:shadow-theme-dark rounded-theme-border outline-none border px-2 py-1  min-w-0 w-full min-h-input"
				/>
				<ButtonBase Variety={BaseButtonVariety.form} type="button" onClick={addBenefits}>
					add new benefits
				</ButtonBase>
				{benefits.map((benefit, index) => (
					<div key={index} className="w-full flex items-center justify-between">
						<span>{benefit}</span>
						<span onClick={() => removeBenefits(index)}>x</span>
					</div>
				))}
			</FormSection>

			<div className="flex flex-col w-full gap-1 text-gray-600">
				<p className="px-2">select your province help for local events </p>
				<Select
					selectId="profileProvinces"
					options={provinces?.map((province) => ({ value: province.id, label: province.title }))}
					onChange={onSelectProvince}
				/>
			</div>

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
