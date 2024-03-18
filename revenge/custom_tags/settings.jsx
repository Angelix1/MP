import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";

const { ScrollView } = General
const { FormSection, FormSwitchRow } = Forms

export default function Settings() {
    useProxy(storage)

    return <ScrollView style={{ flex: 1 }} >
        <FormSection title="Tag style">
            <FormSwitchRow
                label="Use top role color for tag backgrounds"
                value={storage.useRoleColor}
                onValueChange={(v: boolean) => {
                    storage.useRoleColor = v;
                }}
            />
        </FormSection>
    </ScrollView>
}