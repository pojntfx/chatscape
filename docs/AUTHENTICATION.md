# Authentication

```shell
export REGION="eu-north-1"

# You can get these values from the Terraform outputs
export API_URL="https://yrxrxvhs36.execute-api.eu-north-1.amazonaws.com/test"
export USER_POOL_ID="eu-north-1_PSX1V7vnK"
export CLIENT_ID="7e2l4k47qt1i2o1tvnrpo1v9on"

export USERNAME="chatscape-tester@example.com"
export PASSWORD="Your-password1/"

aws cognito-idp sign-up --region ${REGION} --client-id ${CLIENT_ID} --username ${USERNAME} --password ${PASSWORD}
aws cognito-idp admin-confirm-sign-up --user-pool-id ${USER_POOL_ID} --region ${REGION} --username ${USERNAME}

export API_TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id ${USER_POOL_ID} --client-id ${CLIENT_ID} --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} | jq -r '.AuthenticationResult.IdToken')

curl -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/hello-secret"
echo $API_TOKEN | wl-copy
```
