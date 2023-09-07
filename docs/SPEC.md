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

- `id`: UUID for the contact.
- `date`: Timestamp of the message.
- `body`: Content of the message.
- `compositeNamespace`: Combination Namespace of the message sender and recipent.

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
- **Method**: `GET`
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
  - Store message in the messages table, with compositeNamespace - a combination of the senderNamespace and the recipientNamespace (sender:::recipent)

### getMessages

- **Path**: `/get-messages`
- **Method**: `GET`
- **Functionality:**
  - Read namespace from token
  - Receive `contactID` and `body` in the request.
  - Fetch all messages from the database where the compositeNamespace matches (both directions: sender:::recipent and recipent:::sender)
  - Set `them` to true on all of the messages where the senderNamespace is contactID
  - Return the messages
