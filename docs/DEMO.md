# ChatScape Demo

## Setup

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

# export TF_VAR_spa_url="http://localhost:3000" # Uncomment if you want to develop the frontend locally; then `cd fronted && npm run dev` to start it
make -j$(nproc) run

# Note that if you make changes to the API gateway, you'll need to manually redeploy the API gateway from the AWS console or delete & recreate it, as Terraform does not apply the changes otherwise.
```

Now go to [authentication](./AUTHENTICATION.md) and use the outputs from `make run`.

## Integration Tests

> Be sure to set up the authentication first

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
