import { findByName } from "@vendetta/metro";
import { UIElements } from "../../../../lib/utility";

const { FormRow } = UIElements;
const RowCheckmark = findByName("RowCheckmark");

export function SelectRow({ label, subLabel, selected, onPress }) {
    return (
        <FormRow 
            label={label} 
            subLabel={subLabel} 
            trailing={<RowCheckmark selected={selected} />} 
            onPress={onPress} 
        />
    )
}