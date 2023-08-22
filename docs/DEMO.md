# ChatScape Demo

## 1. Setup and Deployment

```shell
cat <<'EOT'>~/.aws/config
[profile GreenGuardianAdministrator-856591169022]
sso_session = GreenGuardian
sso_account_id = 856591169022
sso_role_name = GreenGuardianAdministrator
region = eu-north-1

[sso-session GreenGuardian]
sso_start_url = https://hdm-mi7.awsapps.com/start#
sso_region = eu-north-1
sso_registration_scopes = sso:account:access

[profile ChatScapeAdministrator-856591169022]
sso_session = ChatScape
sso_account_id = 856591169022
sso_role_name = ChatScapeAdministrator
region = eu-north-1

[sso-session ChatScape]
sso_start_url = https://hdm-mi7.awsapps.com/start#
sso_region = eu-north-1
sso_registration_scopes = sso:account:access
EOT

export AWS_PROFILE=ChatScapeAdministrator-856591169022
aws sso login

terraform init --backend-config="password=your-github-token"

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
export API_URL="https://gbgmr3ptoc.execute-api.eu-north-1.amazonaws.com/test"
export USER_POOL_ID="eu-north-1_YeBeiQ0T0"
export CLIENT_ID="7obhpbtjkshebbs144bik4vr6s"

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
