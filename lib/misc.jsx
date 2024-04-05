import { UIElements } from "./utility"

const { FormIcon } = UIElements;


export function addIcon(icon) {
	return (<FormIcon style={{ opacity: 1 }} source={icon} />)
}