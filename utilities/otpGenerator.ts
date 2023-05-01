export function otpGenerator() {
	var minVal = 100000;
	var maxVal = 999999;
	return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}
