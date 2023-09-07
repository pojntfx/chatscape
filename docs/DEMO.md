# ChatScape Demo

## 1. Setup and Deployment

```shell
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_SESSION_TOKEN=""
export GITHUB_TOKEN=""

terraform -chdir=terraform init --backend-config="${GITHUB_TOKEN}"

make -j$(nproc) depend
make -j$(nproc) test

# export TF_VAR_spa_url="http://localhost:3000" # Uncomment if you want to develop the frontend locally; then `cd fronted && npm run dev` to start it
make -j$(nproc) run

# Note that if you make changes to the API gateway, you'll need to manually redeploy the API gateway from the AWS console or delete & recreate it, as Terraform does not apply the changes otherwise.
```

## 2. Authentication

```shell
export REGION="eu-north-1"

# You can get these values from the Terraform outputs
export API_URL="https://fwohuebd3j.execute-api.eu-north-1.amazonaws.com/test"
export USER_POOL_ID="eu-north-1_zqBirZPN9"
export CLIENT_ID="b2l5g1ro6ps7akfvjv2pd1tvn"

# Create first user
export USERNAME="chatscape-tester-1@example.com"
export PASSWORD="Your-password1/"

aws cognito-idp sign-up --region ${REGION} --client-id ${CLIENT_ID} --username ${USERNAME} --password ${PASSWORD}
aws cognito-idp admin-confirm-sign-up --user-pool-id ${USER_POOL_ID} --region ${REGION} --username ${USERNAME}

export API_TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id ${USER_POOL_ID} --client-id ${CLIENT_ID} --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} | jq -r '.AuthenticationResult.IdToken')

# Create second user
export USERNAME="chatscape-tester-2@example.com"
export PASSWORD="Your-password2/"

aws cognito-idp sign-up --region ${REGION} --client-id ${CLIENT_ID} --username ${USERNAME} --password ${PASSWORD}
aws cognito-idp admin-confirm-sign-up --user-pool-id ${USER_POOL_ID} --region ${REGION} --username ${USERNAME}

export API_TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id ${USER_POOL_ID} --client-id ${CLIENT_ID} --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} | jq -r '.AuthenticationResult.IdToken')
```

## 3. Integration Tests

**add-contact**: `{"email":"max@mustermann.de", "name":"max"}`

```shell
curl -X POST --data '{"email":"max@mustermann.de", "name":"max"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/add-contact"
```

**block-contact**: `{"email":"max@mustermann.de"}`

```shell
curl -X POST --data '{"email":"max@mustermann.de"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/block-contact"
```

**report-contact**: `{"email":"max@mustermann.de", "report":"Met at a diner"}`

```shell
curl -X POST --data '{"email":"max@mustermann.de", "report":"Met at a diner"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/report-contact"
```

**get-contacts**:

```shell
curl -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/get-contacts"
```

**add-message**: `{"recipientNamespace":"mate", "message": "Hi"}`

```shell
curl -X POST --data '{"recipientNamespace":"mate", "message": "Hi"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/add-message"
```

**get-messages**: `?recipientNamespace=mate`

```shell
curl -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/get-messages?recipientNamespace=mate"
```
