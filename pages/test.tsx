import Badge from "@components/common/badge";
import CheckBox from "@components/common/check-box";
import Popup from "@components/common/popup";
import Radio from "@components/common/radio-button";
import Toggle from "@components/common/toggle-button";
import { useState } from "react";

export default function ParamTest() {
	const [rOne, setROne] = useState<string | number>("1");
	const [rTwo, setRTwo] = useState<string | number>();

	return (
		<div className="flex flex-col items-center gap-2">
			<label htmlFor="someId"> test it</label>
			<CheckBox id="someId" onChange={(c) => console.log(c)} />
			<Popup
				uniqueId="somePopup"
				label="popy"
				contents={[
					{ id: 1, title: "a", onChange: () => console.log(1) },
					{ id: 2, title: "b", onChange: () => console.log(2) },
					{ id: 3, title: "c", onChange: () => console.log(3) },
					{ id: 4, title: "d", onChange: () => console.log(4) },
				]}
			/>
			<Badge title="b1" />

			<label htmlFor="toggleId"> toggle it</label>
			<Toggle onChange={(v) => console.log(v)} id="toggleId" />

			<label htmlFor="r1">r1</label>
			<Radio id="r1" value="1" onChange={setROne} selected={rOne} />
			<label htmlFor="r2">r2</label>
			<Radio id="r2" value="2" onChange={setROne} selected={rOne} />
			<label htmlFor="r3">r3</label>
			<Radio id="r3" value="w" onChange={setROne} selected={rOne} />
		</div>
	);
}
