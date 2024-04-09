import { storage } from "@vendetta/plugin"
import { UIElements } from "../../../../lib/utility"


const { FormInput } = UIElements

export default function CAT() {
	
	return (<>
		<FormInput
			title="Name"
			keyboardType="default"
			placeholder="Angel"
			value={storage?.utils?.cactus?.name}
			onChange={(val) => (storage.utils.cactus.name = val.toString())}
		/>
	</>)
}
