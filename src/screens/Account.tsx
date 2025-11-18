import React, { useEffect } from "react";

import { useSubscriptions } from "../hooks/useSubscription";

import { Button, Grid } from "../components";
import { useGetUserProfile, useLogout } from "../hooks/useAuth";

export const AccountScreen: React.FC = () => {
  const {
    startSubscription,
    manageSubscription,
    useSubscribedDeepLinkCallback,
    status,
  } = useSubscriptions();

  const [handleLogout, logoutLoading, logoutError] = useLogout();

  const [getUserProfile] = useGetUserProfile();

  useEffect(() => {
    getUserProfile();
  }, []);

  useSubscribedDeepLinkCallback();

  return (
    <Grid gap={16}>
      {status.subscribed ? (
        <Button
          title="Manage Subscription"
          onPress={manageSubscription}
          isLoading={status.requestingManagementUrl}
        />
      ) : (
        <Button
          variant="secondary"
          title={"Subscribe"}
          onPress={startSubscription}
          isLoading={status.requestingPaymentUrl}
        />
      )}

      <Button
        title="Logout"
        onPress={handleLogout}
        isLoading={logoutLoading}
        error={logoutError}
      />
    </Grid>
  );
};
