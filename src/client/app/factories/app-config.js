export default (configResponse) => {
  const {
    firstName,
    lastName,
    companyName,
    googleApiId,
    googleApiSecret,
    googleApiRedirectUrl
  } = configResponse;

  return {
    firstName,
    lastName,
    companyName,
    clientId: googleApiId,
    clientSecret: googleApiSecret,
    redirectUrl: googleApiRedirectUrl
  };
};
