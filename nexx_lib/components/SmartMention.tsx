import { findByProps, findByStoreName } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";

import SimpleText from "./SimpleText";

const { showUserProfile } = findByProps("showUserProfile");
const { fetchProfile } = findByProps("fetchProfile");

const UserStore = findByStoreName("UserStore");

export default function SmartMention({
  userId,
  color,
  loadUsername,
  children,
}: React.PropsWithChildren<{
  userId: string;
  color?: string;
  loadUsername?: boolean;
}>) {
  const [loadedUsername, setLoadedUsername] = React.useState<null | string>(
    null,
  );

  React.useEffect(
    () =>
      !loadedUsername &&
      loadUsername &&
      (UserStore.getUser(userId)
        ? setLoadedUsername(UserStore.getUser(userId).username)
        : fetchProfile(userId).then((x) => setLoadedUsername(x.user.username))),
    [loadUsername],
  );

  return (
    <SimpleText
      variant="text-md/bold"
      color={color ?? "TEXT_NORMAL"}
      onPress={() =>
        UserStore.getUser(userId)
          ? showUserProfile({ userId })
          : fetchProfile(userId).then(() => showUserProfile({ userId }))
      }
    >
      {loadUsername ? `@${loadedUsername ?? "..."}` : children}
    </SimpleText>
  );
}
