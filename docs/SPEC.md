# Specification

## Tables

### Contacts

- `id`: UUID for the contact.
- `name`: Name of the contact.
- `email`: Email of the contact.
- `avatar`: URL or key to the avatar image.
- `blocked`: Boolean indicating if the contact is blocked.
- `namespace`: User namespace.
- `report`: Text that a user reported for the contact

### Messages

- `date`: Timestamp of the message
- `body`: Content of the message.
- `senderNamespace`: Namespace of the message sender.
- `recipientNamespace`: Namespace of the message receiver.

## Lambdas

### addContact

- **Path**: `/add-contact`
- **Method**: `POST`
- **Functionality:**
  - Read namespace from token
  - Receive `name`, `email` in the request.
  - Generate a unique ID for the contact.
  - Insert the contact into the `Contacts` table.
  - Return the created contact.

### getContacts

- **Path**: `/contacts`
- **Method**: `POST`
- **Functionality:**
  - Read namespace from token
  - Query the `Contacts` table for all contacts with the namespace
  - Return the list of contacts.

### blockContact

- **Path**: `/block-contact`
- **Method**: `POST`
- **Functionality:**
  - Read namespace from token
  - Receive `contactID` from the request
  - Update the `blocked` field for the specified contact in the `Contacts` table to true

### reportContact

- **Path**: `/report-contact`
- **Method**: `POST`
- **Functionality:**
  - Read namespace from token
  - Receive `contactID` as a path parameter and `context` in the request body.
  - Set the report field for the context to the text body received

### addMessage

- **Path**: `/add-message`
- **Method**: `POST`
- **Functionality:**
  - Read namespace from token
  - Receive `contactID` and `body` in the request.
  - Store message in the messages table, with recipientNamespace as the contactID from the request, the sender namespace as the namespace from the token and the body from the request (the date is the current time)

### getMessages

- **Path**: `/get-messages`
- **Method**: `POST`
- **Functionality:**
  - Read namespace from token
  - Receive `contactID` and `body` in the request.
  - Fetch all messages from the database where the senderNamespace matches the the user's namespace AND the recipientNamespace matches the contactID, OR where the senderNamespace matches the contactID and AND the recipientNamespace matches the user's namespace
  - Set `them` to true on all of the messages where the senderNamespace is contactID
  - Return the messages
