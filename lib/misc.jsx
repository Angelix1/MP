import { Forms } from "@vendetta/ui/components";

const { FormIcon } = Forms;


export function addIcon(icon) {
	return (<FormIcon style={{ opacity: 1 }} source={icon} />)
}