# Authentication

```shell
export REGION="eu-north-1"

# You can get these values from the Terraform outputs
export API_URL="https://8pnmqlqqe8.execute-api.eu-north-1.amazonaws.com/test"
export USER_POOL_ID="eu-north-1_v2RJb90cC"
export CLIENT_ID="7o8ur804v8cibo8p9sdjop7aii"

export USERNAME="chatscape-tester@example.com"
export PASSWORD="Your-password1/"

aws cognito-idp sign-up --region ${REGION} --client-id ${CLIENT_ID} --username ${USERNAME} --password ${PASSWORD}
aws cognito-idp admin-confirm-sign-up --user-pool-id ${USER_POOL_ID} --region ${REGION} --username ${USERNAME}

export API_TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id ${USER_POOL_ID} --client-id ${CLIENT_ID} --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} | jq -r '.AuthenticationResult.IdToken')

curl -X POST -d '{"name": "Test", "email": "test@example.com"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/add-contact"
echo $API_TOKEN | wl-copy
```
