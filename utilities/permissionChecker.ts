import { PermissionType } from "@prisma/client";

export function permissionHasAccess({ require, current }: { require: PermissionType; current: PermissionType }) {
	switch (require) {
		case "ADMIN":
			if (current === "ADMIN") return true;
			return false;

		case "SUPERVISOR":
			if (current === "ADMIN" || current === "SUPERVISOR") return true;
			return false;

		case "AUTHOR":
			if (current === "ADMIN" || current === "SUPERVISOR" || current === "AUTHOR") return true;
			return false;

		case "USER":
			if (current === "ADMIN" || current === "SUPERVISOR" || current === "AUTHOR" || current === "USER") return true;
			return false;

		case "GUEST":
			return true;

		default:
			return false;
	}
}
