# Run ChatScape

1. Execute `$ export TF_HTTP_PASSWORD="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"` 2.`$ export AWS_PROFILE=ChatScapeAdministrator-856591169022` 2.`$ export AWS_PROFILE=ChatScapeAdministrator-856591169022`
2. Execute `$ cat ~/.aws/config` If empty do the following:
   1. `$ vim ~/.aws/config` :

```conf
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
```

4.  Execute `$ aws sso login`
5.  Execute `$ make run -j$(nproc)`
6.  Adjust `AUTHENTICATION.md` with the output from terraform, open a new shell and execute it:

```shell
export AWS_PROFILE=ChatScapeAdministrator-856591169022
export REGION="eu-north-1"

# You can get these values from the Terraform outputs
export API_URL="https://ed9z5jjx4a.execute-api.eu-north-1.amazonaws.com/test"
export USER_POOL_ID="eu-north-1_MPEyxd6QW"
export CLIENT_ID="6qkcvkog93c23ou0ob2ddhikc2"

export USERNAME="chatscape1-tester@example.com"
export PASSWORD="Your-password1/"

aws cognito-idp sign-up --region ${REGION} --client-id ${CLIENT_ID} --username ${USERNAME} --password ${PASSWORD}
aws cognito-idp admin-confirm-sign-up --user-pool-id ${USER_POOL_ID} --region ${REGION} --username ${USERNAME}

export API_TOKEN=$(aws cognito-idp admin-initiate-auth --user-pool-id ${USER_POOL_ID} --client-id ${CLIENT_ID} --auth-flow ADMIN_USER_PASSWORD_AUTH --auth-parameters USERNAME=${USERNAME},PASSWORD=${PASSWORD} | jq -r '.AuthenticationResult.IdToken')
echo $API_TOKEN
```

```shell
$ curl -X POST --data '{"email":"max@mustermann.de", "name":"max"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/add-contact"
```

## Payloads

**add-contact**: `{"email":"max@mustermann.de", "name":"max", "namespace": "test"}`

```shell
$ curl -X POST --data '{"email":"max@mustermann.de", "name":"max", "namespace": "test"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/add-contact"
```

**block-contact**: `{"email":"max@mustermann.de", "namespace": "test"}`

```shell
$ curl -X POST --data '{"email":"max@mustermann.de",  "namespace": "test"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/block-contact"
```

**report-contact**: `{"email":"max@mustermann.de", "report":"Met at a diner", "namespace": "test"}`

```shell
$ curl -X POST --data '{"email":"max@mustermann.de", "report":"Met at a diner", "namespace": "test"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/report-contact"
```

**get-contacts**: `{"namespace": "test"}`

```shell
$ curl -X POST --data '{"namespace": "test"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/get-contacts"
```

**add-message**: `{"senderNamespace":"check", "recipientNamespace":"mate", "message": "Hi"}`

```shell
$ curl -X POST --data '{"senderNamespace":"check", "recipientNamespace":"mate", "message": "Hi"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/add-message"
```

**get-messages**: `{"senderNamespace":"check", "recipientNamespace":"mate"}`

```shell
$ curl -X POST --data '{"senderNamespace":"check", "recipientNamespace":"mate"}' -H "Authorization: Bearer ${API_TOKEN}" "${API_URL}/get-messages"
```
