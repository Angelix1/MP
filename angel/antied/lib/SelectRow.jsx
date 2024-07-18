import { findByName } from "@vendetta/metro";
import { Forms } from "@vendetta/ui/components";


const { FormRow } = Forms
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
/*

modes.map(({ label, key, renderExtra }, i) => (<>
    <SelectRow 
        label={label} 
        subLabel={renderTimestamp(moment(), key)} 
        selected={storage.selected === key} 
        onPress={() => storage.selected = key} 
    />
        {renderExtra && renderExtra(storage.selected === key)}
        {i !== modes.length - 1 && <FormDivider />}
</>)
*/