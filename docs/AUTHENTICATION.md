# Authentication

```shell
export REGION="eu-north-1"

# You can get these values from the Terraform outputs
export API="https://zm4xv5hv71.execute-api.eu-north-1.amazonaws.com/test"
export CLIENT_ID="eu-north-1_VQtwXqxLN"
export USER_POOL_ID="eu-north-1_VQtwXqxLN"

export USERNAME="chatscape-tester@example.com"
export PASSWORD="your-password"

aws cognito-idp sign-up --region ${REGION} --client-id ${CLIENT_ID} --username ${USERNAME} --password ${PASSWORD}
aws cognito-idp admin-confirm-sign-up --user-pool-id ${REGION}_VQtwXqxLN --region ${REGION} --username ${USERNAME}

export API_TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id ${USER_POOL_ID} --client-id ${CLIENT_ID} --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} | jq -r '.AuthenticationResult.IdToken')

curl -H "Authorization: Bearer ${API_TOKEN}" "${API}/hello-secret"
```
