import { NavigationNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { ErrorBoundary, Forms } from "@vendetta/ui/components";

import log from "../pages/log";
import { plugin } from "@vendetta";

const { FormRow } = Forms;

export default () => {
  const navigation = NavigationNative.useNavigation();
  const stripVersions = (str) => str.replace(/\s?v\d+.\d+.\w+/, "");

  const tits = plugin?.manifest?.name ? `${stripVersions(plugin.manifest.name)} Logs` : "Anti Edit & Delete Logs"

  return (
    <ErrorBoundary>
      <FormRow
        label={tits}
        leading={<FormRow.Icon source={getAssetIDByName("ic_audit_log_24px")} />}
        trailing={FormRow.Arrow}
        onPress={() =>
          navigation.push("VendettaCustomPage", {
            title: tits,
            render: log,
          })
        }
      />
    </ErrorBoundary>
  );
};