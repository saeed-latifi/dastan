type tempOTPType = { code: number; user: number; phone: string; date: number };

export default class TempOTP {
	private static reservedArray: tempOTPType[] = [];
	static {
		const purgeTimeMilliSecond = 1000 * 60 * 7;
		console.log("purger is start!");
		setInterval(() => {
			TempOTP.reservedArray = TempOTP.reservedArray.filter((item) => {
				if (item.date + purgeTimeMilliSecond < Date.now()) {
					return false;
				}
				return true;
			});
			// TODO make log
			// console.log("otp temp : ", TempOTP.reservedArray);
		}, 1000 * 30);
	}

	getAll() {
		return TempOTP.reservedArray;
	}

	getOne(user: number) {
		const res = TempOTP.reservedArray.find((item) => item.user === user);
		return res;
	}

	add({ code, user, phone }: { code: number; user: number; phone: string }) {
		let hasExist = false;

		for (let item of TempOTP.reservedArray) {
			if (item.user === user) {
				item.code = code;
				item.phone = phone;
				item.date = Date.now();
				hasExist = true;
			}
		}

		if (!hasExist) {
			const newEntity: tempOTPType = { user, phone, code, date: Date.now() };
			TempOTP.reservedArray.push(newEntity);
		}

		return TempOTP.reservedArray;
	}

	remove(user: number) {
		TempOTP.reservedArray = TempOTP.reservedArray.filter((item) => item.user !== user);
		return TempOTP.reservedArray;
	}
}
