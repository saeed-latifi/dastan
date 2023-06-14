import ButtonBase from "@components/common/base-button";
import { PermissionType } from "@prisma/client";
import { permissionHasAccess } from "@providers/permissionChecker";
import { useState } from "react";

export default function VideoUpload() {
	const [require, setRequire] = useState<PermissionType>(PermissionType.GUEST);
	const [current, setCurrent] = useState<PermissionType>(PermissionType.GUEST);

	function onCheck() {
		console.log(permissionHasAccess({ current, require }));
	}

	return (
		<div className="flex gap-4">
			<div className="flex flex-col gap-4">
				<span>require</span>
				<select value={require} name="permission" id="permission" onChange={(e) => setRequire(e.target.value as PermissionType)}>
					<option value={PermissionType.GUEST}>{PermissionType.GUEST}</option>
					<option value={PermissionType.USER}>{PermissionType.USER}</option>
					<option value={PermissionType.AUTHOR}>{PermissionType.AUTHOR}</option>
					<option value={PermissionType.SUPERVISOR}>{PermissionType.SUPERVISOR}</option>
					<option value={PermissionType.ADMIN}>{PermissionType.ADMIN}</option>
				</select>
			</div>
			<div className="flex flex-col gap-4">
				<span>current</span>
				<select value={current} name="permission" id="permission" onChange={(e) => setCurrent(e.target.value as PermissionType)}>
					<option value={PermissionType.GUEST}>{PermissionType.GUEST}</option>
					<option value={PermissionType.USER}>{PermissionType.USER}</option>
					<option value={PermissionType.AUTHOR}>{PermissionType.AUTHOR}</option>
					<option value={PermissionType.SUPERVISOR}>{PermissionType.SUPERVISOR}</option>
					<option value={PermissionType.ADMIN}>{PermissionType.ADMIN}</option>
				</select>
			</div>
			<ButtonBase onClick={onCheck}>check</ButtonBase>
		</div>
	);
}
