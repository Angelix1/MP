// from cloud-sync
import { NavigationNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { ErrorBoundary, Forms } from "@vendetta/ui/components";
import { plugin } from "@vendetta";

import Settings from "../Settings";

const { FormRow } = Forms;

export default () => {
  const navigation = NavigationNative.useNavigation();
  const stripVersions = (str: string): string => str.replace(/\s?v\d+.\d+.\w+/, "");

  const tits = plugin?.manifest?.name ? `${stripVersions(plugin.manifest.name)} Settings` : "Anti Edit & Delete Settings"

  return (
    <ErrorBoundary>
      <FormRow
        label={tits}
        leading={<FormRow.Icon source={getAssetIDByName("ic_edit_24px")} />}
        trailing={FormRow.Arrow}
        onPress={() =>
          navigation.push("VendettaCustomPage", {
            title: tits,
            render: Settings,
          })
        }
      />
    </ErrorBoundary>
  );
};