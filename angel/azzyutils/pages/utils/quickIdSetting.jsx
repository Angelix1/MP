import { storage } from "@vendetta/plugin"
import { React } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { Forms } from "@vendetta/ui/components";


const { FormRow, FormSwitch, FormDivider } = Forms

export default function QuickIdSetting() {
	useProxy(storage)

	const cl = (label, subLabel, key) => { 
		return { label, subLabel, key } 
	};

	const lists = [
		cl("Id", "add Copy User Id", "addID"),
		cl("Mention", "add Copy User Mention", "addMention"),
		cl("Id and Mention", "add Copy User Id & Mention", "addCombine"),	
	]

	return (<>
		{
			lists.map((el, i) => {
				return (<>
					<FormRow
						label={el?.label || "Missing Label"}
						subLabel={el?.subLabel}
						trailing={
							<FormSwitch
								value={storage?.utils?.quickid?.[el?.key] || false}
								onValueChange={(value) => {
								storage.utils.quickid[el.key] = value
							}}
							/>
						}
					/>
					{i !== lists?.length - 1 && <FormDivider />}
				</>)
			})
		}
		<FormDivider />
	</>)
}

