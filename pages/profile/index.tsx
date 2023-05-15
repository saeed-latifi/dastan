/* eslint-disable react-hooks/exhaustive-deps */
import ButtonBase, { BaseButtonVariety } from "@components/common/base-button";
import LoaderSpinner from "@components/common/loader-spinner";
import Form from "@components/forms/form";
import FormInput from "@components/forms/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@hooks/useAccount";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select, { selectOptionType } from "@components/common/select";
import { iProvince } from "@models/iProvince";
import SelectMulti from "@components/common/select-multi";
import { iCategory } from "@models/iCategory";
import { iUserUpdate, zUserUpdate } from "@models/iUser";
import { useProvince } from "@hooks/useProvince";
import { useCategory } from "@hooks/useCategory";
import FormSection from "@components/forms/form-section";
import { staticClientURL } from "statics/url";

export default function Profile() {
	const router = useRouter();
	const [selectedProvince, setSelectedProvince] = useState<iProvince>();
	const [selectedCategories, setSelectedCategories] = useState<iCategory[]>();

	const { userInfo, isLoading, checkAccessRedirect, onUpdateUser, onErrorPurge, error } = useAccount();
	const { provinces } = useProvince();
	const { categories } = useCategory();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<iUserUpdate>({
		resolver: zodResolver(zUserUpdate),
		values: userInfo,
	});
	checkAccessRedirect();

	useEffect(() => {
		if (!isLoading && userInfo) {
			setSelectedCategories(userInfo.interests);
		}
	}, [isLoading]);

	function onSelectProvince(option: selectOptionType) {
		setSelectedProvince({ id: option.value, title: option.label });
	}

	function onChangeInterests(options: selectOptionType[]) {
		const interests: iCategory[] = options.map((op) => ({ id: op.value, title: op.label }));
		setSelectedCategories(interests);
	}

	async function onSubmit(body: iUserUpdate) {
		body.interests = selectedCategories;
		body.provinceId = selectedProvince?.id;
		onUpdateUser(body);
	}

	if (isLoading) return <LoaderSpinner />;

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<FormSection title="info">
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
			</FormSection>

			<FormSection title="location">
				<div className="flex flex-col w-full gap-1 text-gray-600">
					<p className="px-2">select your province help for local events </p>
					<Select
						selectId="profileProvinces"
						preSelect={userInfo?.province && { label: userInfo?.province?.title, value: userInfo?.province?.id }}
						options={provinces?.map((province) => ({ value: province.id, label: province.title }))}
						onChange={onSelectProvince}
					/>
				</div>
			</FormSection>

			<FormSection title="interested">
				<div className="flex flex-col w-full gap-1 text-gray-600">
					<p className="px-2">select your interest filed help for better content </p>
					<SelectMulti
						preSelect={
							userInfo?.interests &&
							(userInfo.interests as iCategory[]).map((interest) => ({
								label: interest.title,
								value: interest.id,
							}))
						}
						options={categories?.map((category) => ({
							value: category.id,
							label: category.title,
						}))}
						onChange={onChangeInterests}
					/>
				</div>
			</FormSection>

			<ButtonBase Variety={BaseButtonVariety.form} type="submit" style={{ marginTop: "1rem" }}>
				update
			</ButtonBase>

			<div className="flex flex-col gap-4 max-w-sm w-full  mx-auto">
				<ButtonBase type="button" onClick={() => router.push("/profile/add-image")}>
					update profile image
				</ButtonBase>
				<ButtonBase type="button" onClick={() => router.push("/profile/change-password")}>
					change password
				</ButtonBase>

				<div className="w-full flex flex-col gap-1">
					{userInfo.email && <p className="text-gray-500 select-none mx-auto">{userInfo.email}</p>}
					<ButtonBase type="button" onClick={() => router.push("/profile/email-change/")}>
						change email
					</ButtonBase>
				</div>

				<div className="w-full flex flex-col gap-1">
					{userInfo.phone && <p className="text-gray-500 select-none mx-auto">{userInfo.phone}</p>}
					<ButtonBase type="button" onClick={() => router.push("/profile/add-phone")}>
						{userInfo.phone ? "change phone number" : " Add phone"}
					</ButtonBase>
				</div>
				<div className="w-full flex flex-col gap-1">
					<ButtonBase type="button" onClick={() => router.push("/team")}>
						your teams
					</ButtonBase>
				</div>

				<div className="w-full flex flex-col gap-1">
					<ButtonBase type="button" onClick={() => router.push(staticClientURL.panel.course.all)}>
						your courses
					</ButtonBase>
				</div>
			</div>
		</Form>
	);
}
