# Authentication

```shell
export REGION="eu-north-1"

# You can get these values from the Terraform outputs
export API="https://90a5hnq5j9.execute-api.eu-north-1.amazonaws.com/test"
export CLIENT_ID="17jpnah623ckaon0i82ravuqge"
export USER_POOL_ID="eu-north-1_AdIPbj6aA"

export USERNAME="chatscape-tester@example.com"
export PASSWORD="Your-password1/"

aws cognito-idp sign-up --region ${REGION} --client-id ${CLIENT_ID} --username ${USERNAME} --password ${PASSWORD}
aws cognito-idp admin-confirm-sign-up --user-pool-id ${REGION}_VQtwXqxLN --region ${REGION} --username ${USERNAME}

export API_TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id ${USER_POOL_ID} --client-id ${CLIENT_ID} --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} | jq -r '.AuthenticationResult.IdToken')

curl -H "Authorization: Bearer ${API_TOKEN}" "${API}/hello-secret"
echo $API_TOKEN | wl-copy
```